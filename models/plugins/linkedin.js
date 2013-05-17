
module.exports = function (schema, opts) {

  schema.statics.upsertLinkedInUser = function (data, email, callback) {
    console.notice('upsertLinkedInUser', arguments)
    this
      .findOne({ $or : [ { linkedinId : data.id }, { email : email } ] })
      .exec(function (err, account) {
        if (err || !account) {
          console.error(err, account)
          return callback(err || new Error('Account not found.'))
        }
        return addData(account, callback)
      })
    ;

    function addData (account, callback) {
      console.log('Syncing linkedin data with existing account')
      account.linkedinId = data.id
      console.log('Linkedin ID: ', account.linkedinId, ' Email: ' + email)

      if (account.linkedinId) {
        console.log('User already synced linkedIn account')
        return callback(null, account)
      } 

      try {

        // name and basic info
        account.firstname = account.firstname || data.firstName
        account.lastname = account.lastname || data.lastName
        account.headline = data.headline
        account.description = data.summary
        account.industry = data.industry

        // location 
        if (typeof data.location !== 'undefined') {
          account.city = account.city || data.location.name
          account.country = account.country 
            || data.location.country.code.toUpperCase()
        }

        // avatar 
        account.avatar = account.avatar || data.pictureUrl

        // birthday 
        if (data.dateOfBirth) {
          account.birthday = account.birthday || new Date(
            data.dateOfBirth.year, 
            data.dateOfBirth.month, 
            data.dateOfBirth.day
            )
        }

        // skills 
        account.skills = account.skills || []
        if (data.skills !== undefined) {
          for (var i in data.skills.values) {
            if (data.skills.values[i] !== undefined 
              && data.skills.values[i].skill !== undefined) {
              account.skills.push(data.skills.values[i].skill.name)
            }
          }
        }

        // interests 
        account.interests = account.interests || []
        if (data.interests !== undefined) {
          account.interests = data.interests
        }

        // languages 
        account.languages = account.languages || []

        if (data.languages !== undefined) {
          for (var i in data.languages.values) {
            if (data.languages.values[i] !== undefined 
              && data.languages.values[i].language !== undefined) {
              account.languages.push(data.languages.values[i].language.name)
            }
          }
        }

        // website url 
        if (data.memberUrlResources._total > 0) {
          account.linksUrl = data.memberUrlResources.values[0].url
        }

        // twitter url 
        if (data.twitterAccounts._total > 0) {
          account.linksTwitter = 'http://www.twitter.com/' 
            + data.twitterAccounts.values[0].providerAccountName
        }

        // linkedin url 
        account.linksLinkedin = data.publicProfileUrl

        // employment 
        account.employment = account.employment || []

        if (data.positions !== undefined) {
          for (var i in data.positions.values) {
            if (typeof data.positions.values[i].startDate !== 'undefined') {
              var start = new Date(
                data.positions.values[i].startDate.year, 
                data.positions.values[i].startDate.month, 
                1
                )
            }
            if (typeof data.positions.values[i].endDate !== 'undefined') {
              var end = new Date(
                data.positions.values[i].endDate.year, 
                data.positions.values[i].endDate.month, 
                1
                )
            }
            account.employment.push({
              employer : (data.positions.values[i].company !== undefined 
                ? data.positions.values[i].company.name 
                : ''),
              position : data.positions.values[i].title,
              current : data.positions.values[i].isCurrent,
              start : start,
              end : end
            })
          }
        }

        // employment 
        account.education = account.education || []

        if (data.educations !== undefined) {
          for (var i in data.educations.values) {
            var start = '';
            var end = '';
            
            console.log(data.educations.values[i])


            if (data.educations.values[i].startDate !== undefined 
              && data.educations.values[i].startDate.year !== undefined){

                var month = data.educations.values[i].startDate.month || 0;
                start = new Date(
                  data.educations.values[i].startDate.year,
                  month, 
                  1
                )
            }
            if (data.educations.values[i].endDate !== undefined 
              && data.educations.values[i].endDate.year !== undefined) {

                var month = data.educations.values[i].endDate.month || 11;

                end = new Date(
                data.educations.values[i].endDate.year, 
                month, 
                1
                )
            }
            account.education.push({
              school : data.educations.values[i].schoolName,
              major : data.educations.values[i].fieldOfStudy,
              degree : data.educations.values[i].degree,
              start : start,
              end : end
            })
          }

        }

      } catch (error) {
        console.error(error)
        return callback(error)
      }

      account.save(function (err) {
        callback(err, account)
      })

    }

  }


}
