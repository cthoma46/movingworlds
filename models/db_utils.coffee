
#
#* // USAGE
#*
#*	var DBU = require('./db_utils.js'); var dbu = new DBU(); 
#*	dbu.openConnection( function(err){
#*		if(!err)
#*		dbu.rebuildSEs();
#*		dbu.rebuildUsers();
#*		console.log(dbu.getRandomOpportunity(dbu.places, 8).length);	
#*		console.log(dbu.createSE(1));
#*})
#

Db = require("mongoose/node_modules/mongodb").Db
Connection = require("mongoose/node_modules/mongodb").Connection
Server = require("mongoose/node_modules/mongodb").Server
ObjectID = require("mongoose/node_modules/mongodb").ObjectID
settings = require("./lib/movingworlds").SETTINGS
mongo = require("mongoose/node_modules/mongodb")

DatabaseUtils = ->
  
  @db = new Db(settings.database.name, new Server(settings.database.host, settings.database.port))
  @first_names = ["Jacob", "Isabella", "Ethan", "Sophia", "Michael", "Emma", "Jayden", "Olivia", "William", "Ava", "Alexander", "Emily", "Noah", "Abigail", "Daniel", "Madison", "Aiden", "Chloe", "Anthony", "Mia"]
  @last_names = ["Smith", "Johnson", " Williams", " Jones", " Brown", " Davis", " Miller", " Wilson", " Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"]
  @emails = ["gmail.com", "yahoo.com", "hotmail.com", "me.com", "comcast.net"]
  @places = [
    city: "Shanghai"
    country: "China"
  ,
    city: "Istanbul"
    country: "Turkey"
  ,
    city: "Karachi"
    country: "Pakistan"
  ,
    city: "Mumbai"
    country: "India"
  ,
    city: "Beijing"
    country: "China"
  ,
    city: "Moscow"
    country: "Russia"
  ,
    city: "São Paulo"
    country: "Brazil"
  ,
    city: "Tianjin"
    country: "China"
  ,
    city: "Guangzhou"
    country: "China"
  ,
    city: "Delhi"
    country: "India"
  ,
    city: "Seoul"
    country: "South Korea"
  ,
    city: "Shenzhen"
    country: "China"
  ,
    city: "Jakarta"
    country: "Indonesia"
  ,
    city: "Tokyo"
    country: "Japan"
  ,
    city: "Mexico City"
    country: "Mexico"
  ,
    city: "Kinshasa"
    country: "Democratic Republic of the Congo"
  ,
    city: "Tehran"
    country: "Iran"
  ,
    city: "Bangalore"
    country: "India"
  ,
    city: "Dongguan"
    country: "China"
  ,
    city: "New York City"
    country: "United States"
  ,
    city: "Lagos"
    country: "Nigeria"
  ,
    city: "London"
    country: "United Kingdom"
  ,
    city: "Lima"
    country: "Peru"
  ,
    city: "Bogotá"
    country: "Colombia"
  ,
    city: "Ho Chi Minh City"
    country: "Vietnam"
  ,
    city: "Hong Kong"
    country: "Hong Kong"
  ,
    city: "Bangkok"
    country: "Thailand"
  ,
    city: "Dhaka"
    country: "Bangladesh"
  ,
    city: "Hyderabad"
    country: "India"
  ,
    city: "Cairo"
    country: "Egypt"
  ,
    city: "Hanoi"
    country: "Vietnam"
  ,
    city: "Wuhan"
    country: "China"
  ,
    city: "Rio de Janeiro"
    country: "Brazil"
  ,
    city: "Lahore"
    country: "Pakistan"
  ,
    city: "Ahmedabad"
    country: "India"
  ,
    city: "Baghdad"
    country: "Iraq"
  ,
    city: "Riyadh"
    country: "Saudi Arabia"
  ,
    city: "Singapore"
    country: "Singapore"
  ,
    city: "Santiago"
    country: "Chile"
  ,
    city: "Saint Petersburg"
    country: "Russia"
  ,
    city: "Chennai"
    country: "India"
  ,
    city: "Chongqing"
    country: "China"
  ,
    city: "Kolkata"
    country: "India"
  ,
    city: "Surat"
    country: "India"
  ,
    city: "Yangon"
    country: "Myanmar"
  ,
    city: "Ankara"
    country: "Turkey"
  ,
    city: "Alexandria"
    country: "Egypt"
  ,
    city: "Shenyang"
    country: "China"
  ,
    city: "Suzhou"
    country: "China"
  ,
    city: "New Taipei"
    country: "Taiwan"
  ,
    city: "Johannesburg"
    country: "South Africa"
  ,
    city: "Los Angeles"
    country: "United States"
  ,
    city: "Yokohama"
    country: "Japan"
  ,
    city: "Busan"
    country: "South Korea"
  ,
    city: "Berlin"
    country: "Germany"
  ,
    city: "Cape Town"
    country: "South Africa"
  ,
    city: "Durban"
    country: "South Africa"
  ,
    city: "Jeddah"
    country: "Saudi Arabia"
  ,
    city: "Pyongyang"
    country: "North Korea"
  ,
    city: "Madrid"
    country: "Spain"
  ,
    city: "Nairobi"
    country: "Kenya"
  ,
    city: "Pune"
    country: "India"
  ,
    city: "Jaipur"
    country: "India"
  ,
    city: "Casablanca"
    country: "Morocco"
  ]
  @types = ["experteer", "representative", "prospect"]
  @professions = ["Actuary", "Software Engineer", "Computer Systems Analyst", "Biologist", "Historian", "Mathematician", "Paralegal Assistant", "Statistician", "Accountant", "Dental Hygienist", "Philosopher", "Meteorologist", "Technical Writer", "Bank Officer", "Web Developer", "Industrial Engineer", "Financial Planner", "Aerospace Engineer", "Pharmacist", "Medical Records Technician", "Sociologist", "Stenographer/Court Reporter", "Medical Secretary", "Bookkeeper", "Astronomer", "Economist", "Physicist", "Dietician", "Parole Officer", "Medical Technologist", "Motion Picture Editor", "Geologist", "Civil Engineer", "Computer Programmer", "Industrial Designer", "Petroleum Engineer", "Medical Laboratory Technician", "Occupational Therapist", "Insurance Underwriter", "Purchasing Agent", "Physiologist", "Nuclear Engineer", "Audiologist", "Broadcast Technician", "Market Research Analyst", "Librarian", "Anthropologist", "Architectural Drafter", "Vocational Counselor", "Archeologist"]
  @industries = ["Accounting", "Airlines/Aviation", "Alternative Dispute Resolution", "Alternative Medicine", "Animation", "Apparel and Fashion", "Architecture and Planning", "Arts and Crafts", "Automotive", "Aviation and Aerospace", "Banking", "Biotechnology", "Broadcast Media", "Building Materials", "Business Supplies and Equipment", "Capital Markets", "Chemicals", "Civic and Social Organization", "Civil Engineering", "Commercial Real Estate", "Computer and Network Security", "Computer Games", "Computer Hardware", "Computer Networking", "Computer Software", "Construction", "Consumer Electronics", "Consumer Goods", "Consumer Services", "Cosmetics", "Dairy", "Defense and Space", "Design", "Education Management", "E-Learning", "Electrical/Electronic Manufacturing", "Entertainment", "Environmental Services", "Events Services", "Executive Office", "Facilities Services", "Farming", "Financial Services", "Fine Art", "Fishery", "Food and Beverages", "Food Production", "Fund-Raising", "Furniture", "Gambling and Casinos", "Glass, Ceramics and Concrete", "Government Administration", "Government Relations", "Graphic Design", "Health, Wellness and Fitness", "Higher Education", "Hospital and Health Care", "Hospitality", "Human Resources", "Import and Export", "Individual and Family Services", "Industrial Automation", "Information Services", "Information Technology and Services", "Insurance", "International Affairs", "International Trade and Development", "Internet", "Investment Banking", "Investment Management", "Judiciary", "Law Enforcement", "Law Practice", "Legal Services", "Legislative Office", "Leisure, Travel and Tourism", "Libraries", "Logistics and Supply Chain", "Luxury Goods and Jewelry", "Machinery", "Management Consulting", "Maritime", "Marketing and Advertising", "Market Research", "Mechanical or Industrial Engineering", "Media Production", "Medical Devices", "Medical Practice", "Mental Health Care", "Military", "Mining and Metals", "Motion Pictures and Film", "Museums and Institutions", "Music", "Nanotechnology", "Newspapers", "Nonprofit Organization Management", "Oil and Energy", "selected) Online Media", "Outsourcing/Offshoring", "Package/Freight Delivery", "Packaging and Containers", "Paper and Forest Products", "Performing Arts", "Pharmaceuticals", "Philanthropy", "Photography", "Plastics", "Political Organization", "Primary/Secondary Education", "Printing", "Professional Training and Coaching", "Program Development", "Public Policy", "Public Relations and Communications", "Public Safety", "Publishing", "Railroad Manufacture", "Ranching", "Real Estate", "Recreational Facilities and Services", "Religious Institutions", "Renewables and Environment", "Research", "Restaurants", "Retail", "Security and Investigations", "Semiconductors", "Shipbuilding", "Sporting Goods", "Sports", "Staffing and Recruiting", "Supermarkets", "Telecommunications", "Textiles", "Think Tanks", "Tobacco", "Translation and Localization", "Transportation/Trucking/Railroad", "Utilities", "Venture Capital and Private Equity", "Veterinary", "Warehousing", "Wholesale", "Wine and Spirits", "Wireless", "Writing and Editing"]
  @schools = ["Harvard University", "University of Virginia", "University of Michigan", "Cornell University", "University of Washington", "Stanford University", "University of Wisconsin-Madison", "University of Florida", "Yale University", "Duke University", "The University of Arizona, Tucson Arizona", "Columbia University in the City of New York", "The University of Utah", "Princeton University – Welcome", "USC – University of Southern California", "University of Illinois at Urbana-Champaign", "New York University", "Boston University", "The University of Texas at Austin – Web Central", "Purdue University", "Northwestern University", "University of Pennsylvania", "University of Colorado at Boulder", "The University of Chicago", "Arizona State University", "University of Miami", "The Ohio State University", "The University of Iowa", "The University of Maine", "Utah State University", "University of South Florida", "The University of North Carolina at Chapel Hill", "University of California, Berkeley", "Clemson University", "Northeastern University", "University of California, Davis", "The University of Cincinnati, Cincinnati, Ohio", "The Pennsylvania State University", "North Carolina State University", "University of Minnesota", "The Johns Hopkins University", "University of Massachusetts Amherst", "The University of Maryland", "Florida State University", "Vanderbilt University, Nashville, Tennessee", "The University of Akron : Home Page", "The University of New Mexico", "University of Kentucky", "Rutgers, The State University of New Jersey", "Oakland University", "University of Houston", "The University of Tennessee – Knoxville", "Louisiana State University", "Carnegie Mellon University", "University of California, Los Angeles", "Baylor University", "Ohio University", "Brandeis University", "Michigan State University", "Lamar University", "University of Pittsburgh", "University of California, Irvine", "Florida Atlantic University", "Fordham University", "Humboldt State University", "University of South Carolina", "Oregon State University", "George Mason University", "The George Washington University", "University of Rochester", "Creighton University", "Kansas State University", "Binghamton University – Home", "UC San Diego: Home", "University of Connecticut", "Virginia Tech | Invent the Future", "New Mexico State University", "The University of Kansas", "University of Nevada, Reno", "University of Wyoming", "University of Alaska Fairbanks", "Kennesaw State University", "Brown University", "University of Phoenix", "University of Missouri", "University of Delaware", "Mississippi State University", "Thomas Jefferson University", "Montana State University", "University of Denver – Home", "University at Albany – SUNY", "Georgia Southern University", "Portland State University", "Rice University", "University of Louisville", "University of Idaho", "University of Arkansas", "Andrews University", "Wake Forest University", "Suffolk University Homepage"]
  @degrees = ["Petroleum engineering", "Chemical engineering", "Electrical engineering", "Material science & engineering", "Aerospace engineering", "Physics", "Applied mathematics", "Computer engineering", "Nuclear engineering", "Biomedical engineering", "Economics", "Mechanical engineering", "Statistics", "Industrial engineering", "Civil engineering", "Mathematics", "Environmental engineering", "Management Info. Systems", "Software engineering", "Finance"]
  @type_degree = ["AA", "BA", "MA", "PhD"]
  @genders = ["male", "female"]
  @languages = ["Mandarin", "Spanish", "English", "Bengali", "Hindi", "Portuguese", "Russian", "Japanese", "German", "Chinese", "Javanese", "Korean", "French", "Vietnamese", "Telugu", "Marathi", "Tamil", "Turkish", "Urdu", "Gujarati", "Polish", "Arabic", "Ukrainian", "Italian", "Chinese", "Malayalam", "Kannada", "Oriya", "Panjabi", "Sunda", "Panjabi", "Romanian", "Bhojpuri", "Azerbaijani, South", "Farsi, Western", "Maithili", "Hausa", "Arabic, Algerian Spoken", "Burmese", "Serbo-Croatian", "Chinese, Gan", "Awadhi", "Thai", "Dutch", "Yoruba", "Sindhi", "Arabic, Moroccan Spoken", "Arabic, Saidi Spoken", "Uzbek, Northern", "Malay", "Amharic", "Indonesian", "Igbo", "Tagalog", "Nepali", "Arabic, Sudanese Spoken", "Saraiki", "Cebuano", "Arabic, North Levantine Spoken", "Thai, Northeastern", "Assamese", "Hungarian", "Chittagonian", "Arabic, Mesopotamian Spoken", "Madura", "Sinhala", "Haryanvi", "Marwari", "Czech", "Greek", "Magahi", "Chhattisgarhi", "Deccan", "Chinese, Min Bei", "Belarusan", "Zhuang, Northern", "Arabic, Najdi Spoken", "Pashto, Northern", "Somali", "Malagasy", "Arabic, Tunisian Spoken", "Rwanda", "Zulu", "Bulgarian", "Swedish", "Lombard", "Oromo, West-Central", "Pashto, Southern", "Kazakh", "Ilocano", "Tatar", "Fulfulde, Nigerian", "Arabic, Sanaani Spoken", "Uyghur", "Haitian Creole French", "Azerbaijani, North", "Napoletano-Calabrese", "Khmer, Central", "Farsi, Eastern", "Akan", "Hiligaynon", "Kurmanji", "Shona"]
  @skills = ["Communications Skills", "Analytical Skills", "Computer Literacy", "Flexibility", "Adaptability", "Interpersonal Abilities", "Leadership", "Management", "Multicultural Awareness", "Planning", "Organizing", "Problem-Solving", "Reasoning", "Creativity", "Teamwork", "Honesty", "Integrity", "Morality", "Adaptability", "Flexibility", "Dedication", "Hard-Working", "Work Ethic", "Tenacity", "Dependability", "Reliability", "Responsibility", "Loyalty", "Positive Attitude", "Professionalism", "Conscientious", "Highly Organized", "Dedicated", "Self-Confidence", "Confident", "Hard-Working", "Self-Motivated", "Highly Motivated", "Self-Starter", "Willingness to Learn"]
  @interests = ["Gardening", "Model Building", "Model Rocketry", "Radio-Controlled Modeling", "Scale Modeling", "Sculpting", "Photography", "Home Movies", "Puppets", "Restoring Classic Vehicles", "Audiophilia", "Baton Twirling", "Bonsai", "Computer Programming", "Creative Writing", "Dance", "Drawing", "Genealogy", "Ham Radio", "Home Automation", "Knapping", "Lapidary", "Locksport", "Musical Instruments", "Scrapbooking", "Woodworking", "Painting", "Knitting", "Sewing", "Jewelry Making", "Cooking", "Baking", "Air Sports", "Motor Sports", "Board Sports", "Water Sports", "Mountain Biking", "Cycling", "Rock Climbing", "Surfing", "Kayaking", "Sculling or Rowing", "Running", "Jogging", "Swimming", "Sailing", "Sand Castle Building", "Playing Pet", "Photography", "Billiards", "Bridge", "Bowling", "Boxing", "Chess", "Cubing", "Darts", "Fencing", "Table Football", "Handball", "Martial Arts", "Airsoft", "American Football", "Archery", "Association Football", "Auto Racing", "Badminton", "Baseball", "Basketball", "Climbing", "Cricket", "Cycling", "Disc Golf", "Equestrianism", "Figure Skating", "Fishing", "Footbag", "Golfing", "Gymnastics", "Ice Hockey", "Kart Racing", "Paintball", "Racquetball", "Rugby League Football", "Running", "Shooting Sport", "Squash", "Surfing", "Swimming", "Tennis", "Table Tennis", "Volleyball", "Audiophilia", "Microscopy", "Reading", "Shortwave Listening", "Videophilia (Home Theater)", "Amateur Astronomy", "Amateur Geology", "Bird Watching", "College Football", "Geocaching", "Meteorology", "People Watching", "Surveillance/Stalking", "Travel", "Parkour", "Planking"]
  @fields = ["management", "development", "technical", "education"]
  @employers = ["Santa's Workshop", "Acme Inc.", "Micorsoft", "Safeway", "Honda", "Ford", "General Motors", "Bain & Company", "McKinsey & Company", "Facebook", "MITRE", "Google", "CareerBuilder", "Slalom Consulting", "REI", "Trader Joe's", " Apple", " General Mills", " Rackspace", " Salesforce.com", " United Space Alliance", " Dow Chemical", " Chevron", " Southwest Airlines", " National Instruments", " Wayfair", " Citrix Systems", " QUALCOMM", " SAP America", " Costco Wholesale", " J. Crew", " Procter & Gamble", " Fluor", " Reachlocal", " Johnson & Johnson", " Monsanto Company", " NetApp", " Morningstar", " Intel Corporation", " Disney Parks & Resorts", " Starbucks", " NIKE", " Cleveland Clinic", " Coach", " Ernst & Young", " Sephora USA", " Groupon", " Goldman Sachs", " Intuit", " Accenture", " Nordstrom", " PricewaterhouseCoopers", " Eli Lilly", " MTV Networks", " Scottrade", " NVIDIA", " FedEx"]
  @se_types = ["profit", "non-profit", "hybrid", "other"]
  @status_types = ["currently experteering", "seeking experteering opportunity", "not seeking experteering opportunity"]


DatabaseUtils::openConnection = (callback) ->
  @db.open (err, db) ->
    throw err  if err
    db.authenticate settings.database.username, settings.database.password, (err, val) ->
      console.log err  if err
      callback err, val

DatabaseUtils::getRandomDate = ->
  from = new Date(1900, 0, 1).getTime()
  to = new Date().getTime()
  new Date(from + Math.random() * (to - from))

DatabaseUtils::getRandomBool = ->
  Math.floor(Math.random() * 100) % 2 is 0

DatabaseUtils::getCountries = ->
  countries = []
  i = 0

  while i < @places.length
    countries.push @places[i].country
    i++
  countries

DatabaseUtils::getRandom = (from, max) ->
  total = from.length
  result = []
  if max
    count = Math.floor((Math.random() * max) + 1)
    i = 0

    while i < count
      result.push from[Math.floor(Math.random() * total)]
      i++
  else
    result = from[Math.floor(Math.random() * total)]
  result

DatabaseUtils::getRandomProfile = (type) ->
  profile = undefined
  if type is "experteer"
    pl = @getRandom(@places)
    profile =
      availability:
        start: @getRandomDate()
        end: @getRandomDate()

      value: Math.floor((Math.random() * 100) + 20)
      field: @getRandom(@fields)
      countries: @getRandom(@getCountries(), 20)
      industry: @getRandom(@industries)
      skills: @getRandom(@skills)
      video: "<iframe width=\"560\" height=\"315\" src=\"http://www.youtube.com/embed/waCF81HdKAA\" frameborder=\"0\" allowfullscreen></iframe>"
      goals: @getRandom(@skills)
      motivation: "Curabitur vel enim sapien. Donec eleifend odio et purus lacinia lobortis. Etiam dictum mollis nulla commodo fringilla. Pellentesque sed ipsum id augue aliquet dictum. Integer dui dui, sodales vitae molestie nec, ullamcorper vitae diam. Proin vel felis ante. Pellentesque aliquam mauris augue, vitae porttitor velit. Vestibulum ac sapien mauris."
  else
    profile = null
  profile

DatabaseUtils::getRandomOpportunity = (pl, max) ->
  ops = []
  max = (if not max then 20 else max)
  i = 0

  while i < max
    field = @getRandom(@fields)
    ops.push
      title: field + " Opportunity"
      city: pl.city
      country: pl.country
      details: "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      start: @getRandomDate()
      end: @getRandomDate()
      deadline: @getRandomDate()
      professions: @getRandom(@professions, 3)
      min_experience: Math.floor((Math.random() * 30) + 1)
      field: field
      languages: @getRandom(@languages, 3)
      impact: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      room_board: Math.floor(Math.random() * 100) % 2 is 0
      compensation: Math.floor(Math.random() * 100) % 2 is 0
      benefits: null
      learn: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      placement_partner: null
      post_engagement: Math.floor(Math.random() * 100) % 2 is 0

    i++
  ops

DatabaseUtils::createUser = ->
  fn = @getRandom(@first_names)
  ln = @getRandom(@last_names)
  pl = @getRandom(@places)
  typ = @getRandom(@types)
  first_name: fn
  last_name: ln
  email: fn + ln + "@" + @getRandom(@emails)
  birthday: @getRandomDate()
  city: pl.city
  country: pl.country
  password: "M0v1ng!"
  gender: @getRandom(@genders)
  agree: true
  notification: true
  type: typ
  avatar: "/images/tmp_avatar" + Math.floor(Math.random() * 5) + ".png"
  verified: @getRandomBool()
  professions: @getRandom(@professions, 3)
  industry: @getRandom(@industries)
  career_started: @getRandomDate()
  skills: @getRandom(@skills, 5)
  interests: @getRandom(@interests, 5)
  bio: "I was born, went to school, worked for a while and have had a pretty good life so far."
  lived: @getRandom(@getCountries(), 5)
  visited: @getRandom(@getCountries(), 5)
  languages: @getRandom(@languages, 3)
  signup_date: @getRandomDate()
  status: Math.floor(Math.random() * 3)
  invited_by: null
  friends: null
  connections: null
  links:
    url: "http://www." + fn.toLowerCase() + "_" + ln.toLowerCase() + ".com"
    facebook: "http://www.facebook.com/" + fn.toLowerCase() + "_" + ln.toLowerCase()
    linkedin: "http://www.linkedin.com/" + fn.toLowerCase() + "_" + ln.toLowerCase()
    twitter: "http://www.twitter.com/" + fn.toLowerCase() + "_" + ln.toLowerCase()

  employment: [
    title: @getRandom(@professions)
    employer: @getRandom(@employers)
    city: pl.city
    start: @getRandomDate()
    end: @getRandomDate()
  ,
    title: @getRandom(@professions)
    employer: @getRandom(@employers)
    city: pl.city
    start: @getRandomDate()
    end: @getRandomDate()
  ]
  education: [
    school: @getRandom(@schools)
    major: @getRandom(@degrees)
    degree: @getRandom(@type_degree)
    start: @getRandomDate()
    end: @getRandomDate()
  ,
    school: @getRandom(@schools)
    major: @getRandom(@degrees)
    degree: @getRandom(@type_degree)
    start: @getRandomDate()
    end: @getRandomDate()
  ]
  profile: @getRandomProfile(typ)

DatabaseUtils::createSE = (index) ->
  pl = @getRandom(@places)
  name: "Social Enterprise " + index
  rep_id: null
  city: pl.city
  country: pl.country
  type: @getRandom(@se_types)
  avatar: "/images/icn_se_avatar.png"
  size: Math.floor((Math.random() * 5))
  registered: Math.floor(Math.random() * 100) % 2 is 0
  links:
    url: "http://www.social_enterprise" + index + ".com"
    facebook: "http://www.facebook.com/social_enterprise" + index
    linkedin: "http://www.linkedin.com/social_enterprise" + index
    twitter: "http://www.twitter.com/social_enterprise" + index

  industry: @getRandom(@industries)
  partner_relations: null
  partner_org_relation: null
  introduction: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  impact: "Curabitur vel enim sapien. Donec eleifend odio et purus lacinia lobortis. Etiam dictum mollis nulla commodo fringilla. Pellentesque sed ipsum id augue aliquet dictum. Integer dui dui, sodales vitae molestie nec, ullamcorper vitae diam. Proin vel felis ante. Pellentesque aliquam mauris augue, vitae porttitor velit. Vestibulum ac sapien mauris."
  conduct: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  video: "<iframe width=\"300\" height=\"182\" src=\"http://www.youtube.com/embed/waCF81HdKAA\" frameborder=\"0\" allowfullscreen></iframe>"
  opportunities: @getRandom(@getRandomOpportunity(pl), 10)

DatabaseUtils::rebuildUsers = (count) ->
  self = this
  count = (if not count then 100 else count)
  @db.collection "mw_users", (err, collection) ->
    collection.remove ->
      i = 0

      while i < count
        newUser = self.createUser()
        newUser.avatar = (if newUser.avatar is "/images/tmp_avatar0.png" then null else newUser.avatar)
        collection.save newUser, (err, res) ->
          console.log err  if err

        i++

    setTimeout (->
      collection.count (err, count) ->
        if err
          throw err
        else
          console.log count + " random users created"

    ), 3000


DatabaseUtils::rebuildSEs = (count) ->
  self = this
  count = (if not count then 100 else count)
  @db.collection "mw_ses", (err, collection) ->
    collection.remove ->
      i = 0

      while i < count
        newSe = self.createSE(i)
        collection.save newSe, (err, res) ->
          console.log err  if err

        i++

    setTimeout (->
      collection.count (err, count) ->
        console.log count + " random social enterprises created"

    ), 3000


DatabaseUtils::createContent = (title, type, status) ->
  author_id: 1
  type: type or "page"
  status: status or "published"
  updated: new Date()
  created: new Date()
  weight: 0
  slug: "home"
  title: title or "Home"
  body: "<p> this is the " + title + " page</p>"
  parent_id: null
  category_id: null
  template: null

module.exports = DBU = DatabaseUtils


##-------------------------------------------------------------

dbu = new DBU()
console.log dbu
# dbu.openConnection (err) ->
  # dbu.rebuildSEs()  unless err
  # dbu.rebuildUsers();



# console.log(dbu.getRandomOpportunity(dbu.places, 8).length);	
# console.log(dbu.createSE(1));
