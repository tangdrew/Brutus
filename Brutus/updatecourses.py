import requests
import pymongo
from pymongo import MongoClient
import time

# get mongo stuff
client = MongoClient('mongodb://localhost:27017')

db = client['brutus']

term_ids = []
courses = []
new_term = []
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



#Get list of terms in the db
terms = db.terms.find()
term_array = []
for i in terms:
    term_array.append(i['_id'])
    print i['_id']

max_term = max(term_array)

terms_obj = response.json()

# look through terms to get the course data for each term
for term_obj in terms_obj:
    #Only add data for terms not in db
    if term_obj['id'] > max_term:
        
        # get all the subjects for the term
        params['term'] = term_obj['id']
    
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
        print "TERM ID " + str(term_obj['id'])
    
        # grab the classes
        subject_array = []
        for termsubject in termsubjects_obj:
            # time.sleep(5)
            #Add subject to subject_array to save to term collection at end 
            subject_array.append(termsubject)
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
            for course in courses_obj:
                results = db.courses.find_one({'title': course['title'], 'instructor.name': course['instructor']['name']})
                #Checks if course exists
                if results != None:
                    #If already exists store new course term with same ratings
                    course['rating'] = results['rating']
                    course['difficulty'] = results['difficulty']
                    course['grade'] = results['grade']
                    course['numreviews'] = results['numreviews']
                    course['avghours'] = results['avghours']
                    course['_id'] = course['id']
                    courses.append(course)
                    print "adding course " + course['title']
                    #db.courses.save(course)
                else:
                    #If doesn't exist store new course term with null ratings
                    course['rating'] = ''
                    course['difficulty'] = ''
                    course['grade'] = 0
                    course['numreviews'] = 0
                    course['avghours'] = 0
                    course['_id'] = course['id']
                    courses.append(course)
                    print "adding course " + course['title']
                    #db.courses.save(course)
        
        #Write the subject_array to term collection
        #Save new term to term collection
        term_obj['subjects'] = subject_array
        term_obj['_id'] = term_obj['id']
        db.terms.save(term_obj)
print "done" 