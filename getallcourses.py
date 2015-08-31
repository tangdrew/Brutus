import requests
import pymongo
from pymongo import MongoClient
import time

# get mongo stuff
client = MongoClient('mongodb://localhost:27017')

db = client['brutus']



term_ids = []
courses = []
params = {
    'key': '2IlpNqx4bxh6HfJn'
}




# get all these terms
response = ''
count = 0
while response == '' and count < 20:
    try:
        response = requests.get('http://api.asg.northwestern.edu/terms/', params=params, timeout=2)
    except:
        print "REQUEST TO TERMS TIMED OUT"
    count += 1

if response == '':
    print "HTTP REQUEST FAILED"
    raise SystemExit

terms_obj = response.json()

# grab the term numbers and strings
for term_obj in terms_obj:
    term_ids.append(term_obj['id'])

print term_ids

# look through terms to get the course data for each term
for term_id in term_ids:
    # time.sleep(5)
    if term_id == 4390:
        break

    # get all the subjects for the term
    params['term'] = term_id

    response = ''
    count = 0
    while response == '' and count < 20:
        try:
            response = requests.get('http://api.asg.northwestern.edu/subjects/', params=params, timeout=2)
        except:
            print "REQUEST TO SUBJECTS TIMED OUT"
        count += 1

    if response == '':
        print "HTTP REQUEST FAILED"
        raise SystemExit

    termsubjects_obj = response.json()
    print "TERM ID " + str(term_id)

    # grab the classes
    for termsubject in termsubjects_obj:
        # time.sleep(5)
        print "IN SUBJECT " + termsubject['symbol']

        params['subject'] = termsubject['symbol']

        response = ''
        count = 0
        while response == '' and count < 20:
            try:
                response = requests.get('http://api.asg.northwestern.edu/courses/details/', params=params, timeout=2)
            except:
                print "REQUEST TO COURSES FAILED"
            count += 1

        if response == '':
            print "HTTP REQUEST FAILED"
            raise SystemExit


        
        courses_obj = response.json()

        # add each class to the db
        for course in courses_obj:
            course['rating'] = ''
            course['difficulty'] = ''
            course['grade'] = 0
            course['numreviews'] = 0
            course['avghours'] = 0
            course['_id'] = course['id']
            courses.append(course)
            print "adding course " + course['title']
            db.courses.save(course)
            # time.sleep(.05)

print "done"
