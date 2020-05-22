import os
from flask import Flask, redirect, url_for, request, render_template
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb://sampleuser:pass123@ds119020.mlab.com:19020/fladocks")
# client = MongoClient("mongodb://127.0.0.1:27017/todoapp")
db = client['fladocks']


@app.route('/')
def todo():
    req_headers = request.headers
    dir = "static"
    full_path = os.path.join(dir, "logs")
    filename = full_path +'/request_headers.txt'

    if os.path.exists(filename):
        append_write = 'a'  # append if already exists
    else:
        append_write = 'w'  # make a new file if not

    app_logs = open(filename, append_write)
    app_logs.write("Request Headers: " + '\n' + str(req_headers))
    app_logs.write("============================"+ '\n')
    app_logs.close()

    _items = db.todos.find()
    items = [item for item in _items]

    return render_template('index.html', items=items)

@app.route('/delete-logs', methods=['GET'])
def del_logs():
    # code to delete entire data
    # but not the file, it is in
    dir_1 = "static"
    path_to_file = os.path.join(dir_1, "logs")
    # open file
    f = open(str(path_to_file) + "/request_headers.txt", "r+")

    # absolute file positioning
    f.seek(0)

    # to erase all data
    f.truncate()

    return "Log content Delete successful"

@app.route('/new', methods=['POST'])
def new():

    item_doc = {
        'name': request.form['name'],
        'description': request.form['description']
    }
    db.todos.insert_one(item_doc)

    return redirect(url_for('todo'))


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
