User = require("../models").User
SE = require("../models").SocialEnterprise
_ = require("underscore")
moment = require("moment")
passport = require("passport")
bcrypt = require("bcrypt")
util = require("util")
ObjectID = require("mongoose/node_modules/mongodb").ObjectID

module.exports = [

    path: "/register/:coupon"
    type: "GET"
    login: "none"
    action: (req, res, next) ->
      passport.authenticate("local", (err, user, info) ->
        coupon = req.params.coupon
        req.session.redirect = "/register/" + coupon

        User.findOne "invite.coupon": coupon , (err, user) ->

          if !err && user
            req.logIn user, (err) ->

              console.log 'Register login:', user.email;

              next err if err

              res.render 'register',
                title: 'register'
                user: user,
                headtype: 'nonav'
                warning: req.flash 'warning'
                error: req.flash 'error'

          else
            next( new Error('MovingWorlds is an invite only community') );

          return

        return

      )(req, res, next)
      return

  ,
    path: "/register"
    type: "POST"
    action: (req, res, next) ->
      User.findById req.user._id, (err, user) ->
        return new Error("There was a problem saving your information.")  if err or not user

        # delete user.invite.coupon;
        user.type = req.body.type
        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.birthday = req.body.birthday
        user.city = req.body.city
        user.country = req.body.country
        user.password = req.body.password
        user.confirm = req.body.confirm
        user.gender = req.body.gender
        user.agree = req.body.agree
        user.notify = req.body.notify


        if not user.type or not user.first_name or not user.last_name or not user.birthday or not user.city or not user.country or not user.password or not user.confirm or not user.gender or not user.agree
          req.flash "error", "All fields are required"
          return res.redirect("back")

        #2. check passwords and confirm if they are the same
        unless user.password is user.confirm
          req.flash "error", "Your passwords did not match"
          return res.redirect("back")

        #3. ensure validation code corresponds with email address
        # TODO:

        #4. make sure type is defined
        if !user.type?
          req.flash "error", "Choose \"I want to go experteering\" or \"I want support for my organization\""
          return res.redirect("back")

        password = user.password

        delete user.password
        delete user.confirm

        salt = bcrypt.genSaltSync(10)
        user.hash = bcrypt.hashSync(password, salt)

        # console.log(user.hash, user.salt);
        # Create a new user in your data store
        user.save (err) ->
          return new Error("There was a problem saving your information.")  if err
          # console.log user
          res.redirect "/register/2/" + user.type
  ,
    path: "/register/:step/experteer"
    type: "GET"
    login: 'experteer'
    action: (req, res) ->
      view = "register/experteer/step" + req.params.step
      res.render view,
        title: "register"
        headtype: "nonav"
  ,
    path: "/register/2/experteer"
    type: "ALL"
    login: 'experteer'
    action: (req, res) ->
      User.findById req.user._id, (err, user) ->
        unless err
          req.body.skills = String(req.body.skills).split(",")
          req.body.interests = String(req.body.interests).split(",")
          req.body.lived = String(req.body.lived).split(",")
          req.body.visited = String(req.body.visited).split(",")
          req.body.languages = String(req.body.languages).split(",")
          user = _.extend(user, req.body)
          user.save (err) ->
            unless err
              res.redirect "/register/3/experteer"
            else
              req.flash "message", err
              res.redirect "/register/2/experteer"
        else
          req.flash "message", err
          res.redirect "/register/2/experteer"
  ,
    path: "/register/3/experteer"
    type: "POST"
    login: 'experteer'
    action: (req, res) ->
      User.findById req.user._id, (err, user) ->
        unless err
          user.professions = String(req.body.professions).split(",")
          user.industry = req.body.industry
          user.career_started = (if (req.body.career_started > 0) then moment().subtract("years", req.body.career_started).toDate().getFullYear() else null)

          unless user.employment
            user.employment = []

          for item of req.body.employer
            job = new Object()

            for employment in user.employment

              if req.body.employerId[item] == employment._id.toString()
                employment.employer = req.body.employer[item] or ""
                employment.city = req.body.city[item] or ""
                employment.position = req.body.position[item] or ""
                employment.save (err) ->
                  if err
                    console.log(err)

            if req.body.employerId[item] == ""
              job["employer"] = req.body.employer[item] or ""
              job["city"] = req.body.city[item] or ""
              job["position"] = req.body.position[item] or ""
              user.employment.push job  if job.employer.length > 0 or job.city.length > 0 or job.position.length > 0

          unless user.education
            user.education = []

          for item of req.body.school
            edu = new Object()

            for education in user.education
              if req.body.educationId[item] == education._id.toString()
                education.school = req.body.school[item] or ""
                education.major = String(req.body.major[item]).split(",") or []
                education.graduated = typeof req.body.graduated[item] isnt "undefined"  if req.body.hasOwnProperty("graduated")
                education.degree = req.body.degree[item] or ""
                education.start = req.body.start[item] or ""
                education.end = req.body.end[item] or ""
                education.save (err) ->
                  if err
                    console.log(err)

            if req.body.educationId[item] == ""
              edu["school"] = req.body.school[item] or ""
              edu["major"] = String(req.body.major[item]).split(",") or []
              edu["graduated"] = typeof req.body.graduated[item] isnt "undefined"  if req.body.hasOwnProperty("graduated")
              edu["degree"] = req.body.degree[item] or ""
              edu["start"] = req.body.start[item] or ""
              edu["end"] = req.body.end[item] or ""
              user.education.push edu  if edu.school.length > 0 or edu.degree.length > 0 or edu.graduted or edu.degree.start > 0 or edu.degree.end > 0

          user.save (err) ->
            unless err
              res.redirect "/register/4/experteer"
            else
              req.flash "message", err
              res.redirect "/register/3/experteer"

        else
          req.flash "message", err
          res.redirect "/register/3/experteer"
  ,
    path: "/register/:step/representative"
    type: "GET"
    login: "se"
    action: (req, res) ->
      view = "register/representative/step" + req.params.step
      res.render view,
        title: "register"
        headtype: "nonav"
  ,
    path: "/register/2/representative"
    type: "POST"
    login: "se"
    action: (req, res) ->
      rep_id = req.user._id
      SE.update
        rep_id: req.user._id
      , req.body,
        multi: false
        upsert: true
      , (err, numAffected) ->
        unless err
          res.redirect "/register/3/representative"
        else
          req.flash "message", err
          res.redirect "/register/2/representative"
  ,
    path: "/register/3/representative"
    type: "POST"
    login: "se"
    action: (req, res) ->
      rep_id = req.user._id

      SE.findOne rep_id: rep_id, (err, se) ->
        unless err
          se.opportunities.push req.body.opportunity

          se.save (err) ->
            unless err
              res.redirect "/register/4/representative"
            else
              console.log err
              req.flash "message", err
              res.redirect "/register/3/representative"
        else
          req.flash "message", err
          res.redirect "/register/3/representative"
]
