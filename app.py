import os
from flask import Flask, redirect, url_for, request, render_template, send_file, send_from_directory
from pymongo import MongoClient
import datetime

app = Flask(__name__)

# client = MongoClient("mongodb://sampleuser:pass123@ds119020.mlab.com:19020/fladocks")
# client = MongoClient("mongodb://127.0.0.1:27017/todoapp")
# db = client['fladocks']

@app.route('/sta/<path:path>')
def getStaticFile(path):
    fn = str(path).split("/")[-1]
    file_type = str(fn).split(".")[-1]

    dir = "static"
    full_path = os.path.join(dir, "logs")
    if file_type in ['png','jpg','jpeg']:
        req_headers = request.headers
        filename = full_path + '/request_headers_img.txt'

        if os.path.exists(filename):
            append_write = 'a'  # append if already exists
        else:
            append_write = 'w'  # make a new file if not

        now = datetime.datetime.now()
        date_time = now.strftime("%d/%m/%Y, %H:%M:%S")
        app_logs = open(filename, append_write)
        app_logs.write("============================" + '\n')
        app_logs.write(date_time + '\n')
        app_logs.write("Request Headers: " + '\n' + str(req_headers))
        app_logs.write("============================" + '\n')
        app_logs.close()

        # fn = os.path.join(dir, "img") + '/mario-2.png'
    elif file_type == 'css':
        req_headers = request.headers
        filename = full_path + '/request_headers_css.txt'

        if os.path.exists(filename):
            append_write = 'a'  # append if already exists
        else:
            append_write = 'w'  # make a new file if not

        now = datetime.datetime.now()
        date_time = now.strftime("%d/%m/%Y, %H:%M:%S")
        app_logs = open(filename, append_write)
        app_logs.write("============================" + '\n')
        app_logs.write(date_time + '\n')
        app_logs.write("Request Headers: " + '\n' + str(req_headers))
        app_logs.write("============================" + '\n')
        app_logs.close()

    elif file_type == 'js':
        req_headers = request.headers
        filename = full_path + '/request_headers_js.txt'

        if os.path.exists(filename):
            append_write = 'a'  # append if already exists
        else:
            append_write = 'w'  # make a new file if not

        now = datetime.datetime.now()
        date_time = now.strftime("%d/%m/%Y, %H:%M:%S")
        app_logs = open(filename, append_write)
        app_logs.write("============================" + '\n')
        app_logs.write(date_time + '\n')
        app_logs.write("Request Headers: " + '\n' + str(req_headers))
        app_logs.write("============================" + '\n')
        app_logs.close()

    elif file_type == 'html':
        req_headers = request.headers
        filename = full_path + '/request_headers_srto.txt'

        if os.path.exists(filename):
            append_write = 'a'  # append if already exists
        else:
            append_write = 'w'  # make a new file if not

        now = datetime.datetime.now()
        date_time = now.strftime("%d/%m/%Y, %H:%M:%S")
        app_logs = open(filename, append_write)
        app_logs.write("============================" + '\n')
        app_logs.write(date_time + '\n')
        app_logs.write("Request Headers: " + '\n' + str(req_headers))
        app_logs.write("============================" + '\n')
        app_logs.close()

    return send_from_directory('static', path)


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

    now = datetime.datetime.now()
    date_time = now.strftime("%d/%m/%Y, %H:%M:%S")
    app_logs = open(filename, append_write)
    app_logs.write("============================" + '\n')
    app_logs.write(date_time + '\n')
    app_logs.write("Request Headers: " + '\n' + str(req_headers))
    app_logs.write("============================"+ '\n')
    app_logs.close()

#     _items = db.todos.find()
#     items = [item for item in _items]
    items = {"abc":123, "bcd": 234, "efg": 456}
    return render_template('index.html', items=items)

@app.route('/delete-logs/<headers_file>', methods=['GET'])
def del_logs(headers_file):
    # code to delete entire data
    # but not the file, it is in
    fn = headers_file
    dir_1 = "static"
    path_to_file = os.path.join(dir_1, "logs/")
    filename = path_to_file + str(headers_file)
    # open file
    if os.path.exists(filename):
        f = open(filename, "r+")

        # absolute file positioning
        f.seek(0)

        # to erase all data
        f.truncate()

        return "Log file content Delete successful"

    else:
        return "Log file doesn't exist"
'''
@app.route('/new', methods=['POST'])
def new():

    item_doc = {
        'name': request.form['name'],
        'description': request.form['description']
    }
    db.todos.insert_one(item_doc)

    return redirect(url_for('todo'))
'''
# Upgrading to heroku-20

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
