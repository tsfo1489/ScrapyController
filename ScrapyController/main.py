import os, json
import shutil
from base64 import b64decode
from zipfile import ZipFile
from werkzeug.utils import secure_filename
from flask import Flask, request, make_response
from flask_cors import CORS
from executor import executor
from log import LogWatcher, LogJson
from scheduler import scheduler
from datetime import datetime

CRAWLER_FILE_PATH = ''
TASK_FILE_PATH = ''
SCHEDULE_FILE_PATH = ''
config_file = open('.SCCconfig', 'r')
for x in config_file.read().split('\n'):
    exec(x)
crawlers = json.loads(open(CRAWLER_FILE_PATH, 'r').read())
tasks = json.loads(open(TASK_FILE_PATH, 'r').read())
schedules = json.loads(open(SCHEDULE_FILE_PATH, 'r').read())
logs = {}

app = Flask('SCC')
CORS(app)

def read_state():
    global crawlers, tasks, schedules
    crawlers = json.loads(open(CRAWLER_FILE_PATH, 'r').read())
    tasks = json.loads(open(TASK_FILE_PATH, 'r').read())
    schedules = json.loads(open(SCHEDULE_FILE_PATH, 'r').read())

def write_tasks():
    f = open(TASK_FILE_PATH, 'w')
    f.write(json.dumps(tasks, indent=2))
    f.close()
def write_crawlers():
    f = open(CRAWLER_FILE_PATH, 'w')
    f.write(json.dumps(crawlers, indent=2))
    f.close()
def write_schedules():
    f = open(SCHEDULE_FILE_PATH, 'w')
    f.write(json.dumps(schedules, indent=2))
    f.close()

@app.route('/crawlers', methods=['GET'])
def get_crawlers():
    global crawlers, tasks, schedules
    return json.dumps(crawlers), 200

@app.route('/crawlers/<crawler_name>', methods=['POST'])
def add_crawlers(crawler_name):
    global crawlers, tasks, schedules
    new_crawler = request.get_json()
    if crawler_name in crawlers:
        return json.dumps({'message': 'ERROR: Duplicate Crawler Name'}), 201
    else:
        filename = new_crawler['file_name']
        with open(filename, 'wb') as zf:
            zf.write(b64decode(new_crawler['file_bytes']))
        try:
            with ZipFile(filename) as zf:
                os.mkdir('./' + filename[:filename.rfind('.zip')])
                zf.extractall('./' + filename[:filename.rfind('.zip')])
            os.remove(filename)
        except:
            return json.dumps({'message': 'Zipfile is wrong'}), 400
        del new_crawler['file_name']
        del new_crawler['file_bytes']
        crawlers[crawler_name] = new_crawler
        write_crawlers()
        return json.dumps({'message': 'Success'}), 200
        
@app.route('/crawlers/<crawler_name>', methods=['DELETE'])
def delete_crawler(crawler_name):
    global crawlers, tasks, schedules
    if crawler_name not in crawlers:
        return json.dumps({'message': f'Crawler({crawler_name}) does not exist'}), 400
    del crawlers[crawler_name]
    write_crawlers()
    return json.dumps({'message': f'Success'}), 200

@app.route('/tasks', methods=['GET'])
def get_tasks():
    global crawlers, tasks, schedules
    return make_response(json.dumps(tasks), 200)

def valid_task(task):
    global crawlers, tasks, schedules
    fields = ['crawler', 'log', 'parameters', 'options']
    msg = 'valid'
    for field in fields:
        if field not in task:
            msg = f'Task needs {field}'
            return False, msg
    read_state()
    if task['crawler'] not in crawlers:
        msg = f'Crawler({task["crawler"]}) does not exist'
        return False, msg
    if task['spider'] not in crawlers[task['crawler']]['spiders']:
        return False, f'Spider({task["spider"]}) does not exist in Crawler({task["crawler"]})'
    for param in task['parameters']:
        if param not in crawlers[task['crawler']]['spiders'][task['spider']]['parameters']:
            return False, f'Spider({task["spider"]}) does not have parameter({param})'
    return True, msg

@app.route('/tasks/<task_name>', methods=['POST'])
def add_tasks(task_name):
    global crawlers, tasks, schedules
    read_state()
    new_task = request.get_json()
    if task_name in tasks:
        return json.dumps({'message': 'ERROR: Duplicate Task Name'}), 400
    else:
        valid, msg = valid_task(new_task)
        if valid:
            new_task['temp_log'] = ''
            new_task['by'] = 'manual'
            new_task['status'] = 'ready'
            tasks[task_name] = new_task
            write_tasks()
            return json.dumps({'message': 'Success'}), 201
        else:
            return json.dumps({'message': msg}), 400

@app.route('/tasks/<task_name>', methods=['DELETE'])
def delete_task(task_name):
    global crawlers, tasks, schedules
    read_state()
    if task_name not in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    del tasks[task_name]
    if task_name in logs:
        del logs[task_name]
    write_tasks()
    read_state()
    return json.dumps({'message': f'Success'}), 200

@app.route('/run/<task_name>', methods=['POST'])
def run_tasks(task_name):
    global crawlers, tasks, schedules
    read_state()
    if task_name not in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if tasks[task_name] == 'run':
        return json.dumps({'message': f'Task({task_name}) already run'}), 400
    task = tasks[task_name]
    run_data = {}
    run_data['path'] = crawlers[task['crawler']]['path']
    run_data['spider'] = task['spider']
    run_data['parameters'] = task['parameters']
    run_data['file'] = task_name + '.json'
    run_data['options'] = task['options']
    run_data['options']['LOG_FILE'] = task['log']
    pid, log_setting = executor(run_data)
    tasks[task_name]['temp_log'] = log_setting['TEMP_LOG']
    tasks[task_name]['status'] = 'run'
    logs[task_name] = LogWatcher(log_setting['TEMP_LOG'])
    write_tasks()
    return json.dumps({'message': 'Task started'}), 200

@app.route('/tasks_stats', methods=['GET'])
def get_tasks_stats():
    global crawlers, tasks, schedules
    read_state()
    refresh_all()
    task_stat = {}
    task_stat.update(tasks)
    for task_name in task_stat:
        if tasks[task_name]['status'] == 'ready':
            task_stat[task_name]['stats'] = {}
        else:
            if tasks[task_name]['status'] == 'run':
                logs[task_name] = LogWatcher(tasks[task_name]['temp_log'])
            else:
                logs[task_name] = LogWatcher(tasks[task_name]['log'])
            task_stat[task_name]['stats'] = logs[task_name].get_stat().todict()
    return json.dumps(task_stat, indent=2), 200

@app.route('/stats/<task_name>', methods=['GET'])
def get_stats(task_name):
    global crawlers, tasks, schedules
    read_state()
    if not task_name in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if tasks[task_name]['status'] == 'ready':
        return json.dumps({
            'message': f'Task({task_name}) not started', 
            'task_data': json.dumps(tasks[task_name], ensure_ascii=False)}), 202
    if task_name not in logs:
        if tasks[task_name]['status'] == 'run':
            logs[task_name] = LogWatcher(tasks[task_name]['temp_log'])
        else:
            logs[task_name] = LogWatcher(tasks[task_name]['log'])
    task_stats = logs[task_name].get_stat()
    if tasks[task_name]['status'] == 'run' and task_stats.status == 'finish':
        tasks[task_name]['status'] = 'finish'
        write_tasks()
        del logs[task_name]
        shutil.copy('./log/' + tasks[task_name]['temp_log'], './log/' + tasks[task_name]['log'])
        os.remove('./log/' + tasks[task_name]['temp_log'])
        logs[task_name] = LogWatcher(tasks[task_name]['log'])
        task_stats = logs[task_name].get_stat()
    task_stats = task_stats.todict()
    task_stats.update(tasks[task_name])
    print(task_stats)
    return json.dumps(task_stats), 200

@app.route('/logs/<task_name>', methods=['GET'])
def get_log(task_name):
    global crawlers, tasks, schedules
    read_state()
    if not task_name in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if tasks[task_name]['status'] == 'ready':
        return json.dumps({'message': f'Task({task_name}) not started'}), 400
    if tasks[task_name]['status'] == 'run':
        log_file = tasks[task_name]['temp_log']
    else:
        log_file = tasks[task_name]['log']
    print(LogJson(log_file))
    return json.dumps(LogJson(log_file)), 200

@app.route('/refresh', methods=['POST'])
def refresh_all():
    global crawlers, tasks, schedules
    for task_name in logs:
        temp_stat = logs[task_name].get_stat()
        if tasks[task_name]['status'] == 'run' and temp_stat.status == 'finish':
            tasks[task_name]['status'] = 'finish'
            write_tasks()
            del logs[task_name]
            shutil.copy('./log/' + tasks[task_name]['temp_log'], './log/' + tasks[task_name]['log'])
            os.remove('./log/' + tasks[task_name]['temp_log'])
            logs[task_name] = LogWatcher(tasks[task_name]['log'])
    return json.dumps({'message': 'Success'}), 200

def valid_schedule(sch):
    global crawlers, tasks, schedules
    sch_fields = ['cycle', 'day', 'time', 'crawler', 'spider', 
                  'log', 'parameters', 'options']
    msg = 'valid'
    for field in sch_fields:
        if field not in sch:
            msg = f'Schedule needs {field}'
            return False, msg
    if sch['cycle'] != 'day':
        sch['day'] = [int(x) for x in sch['day']]
        for day in sch['day']:
            if type(day) != int:
                day = int(day)
            if sch['cycle'] == 'week':
                if day < 0 or day > 6 :
                    msg = f'Day must be in 0~6 not {day}'
                    return False, msg
            else:
                if day < 0 or day > 31:
                    msg = f'Day must be in 0~31 not {day}'
                    return False, msg
    if sch['crawler'] not in crawlers:
        msg = f'Crawler({sch["crawler"]}) does not exist'
        return False, msg
    if sch['spider'] not in crawlers[sch['crawler']]['spiders']:
        return False, f'Spider({sch["spider"]}) does not exist in Crawler({sch["crawler"]})'
    return True, msg

@app.route('/schedules', methods=['GET'])
def get_schedule():
    global crawlers, tasks, schedules
    return json.dumps(schedules), 200

@app.route('/schedules/<sch_name>', methods=['POST'])
def add_schedule(sch_name):
    global crawlers, tasks, schedules
    new_sch = request.get_json()
    print(new_sch)
    if sch_name in schedules:
        return json.dumps({'message': 'ERROR: Duplicate Schedule Name'}), 400
    else:
        valid, msg = valid_schedule(new_sch)
        if valid:
            schedules[sch_name] = new_sch
            write_schedules()
            return json.dumps({'message': 'Success'}), 201
        else:
            return json.dumps({'message': msg}), 400

@app.route('/schedules/<sch_name>', methods=['DELETE'])
def delete_schedule(sch_name):
    global crawlers, tasks, schedules
    if sch_name not in schedules:
        return json.dumps({'message': f'Schedule({sch_name}) does not exist'}), 400
    del schedules[sch_name]
    write_schedules()
    return json.dumps({'message': f'Success'}), 200

def schedule_task(sch_list):
    global crawlers, tasks, schedules
    now = datetime.now()
    for sch in sch_list:
        print('Run', sch)
        new_task = {}
        dateime_suffix = '_' + datetime.strftime(now,"%y%m%d%H%M")
        task_name = sch + dateime_suffix
        new_task['crawler'] = schedules[sch]['crawler']
        new_task['spider'] = schedules[sch]['spider']
        new_task['log'] = schedules[sch]['log'] + dateime_suffix
        new_task['parameters'] = schedules[sch]['parameters']
        new_task['options'] = schedules[sch]['options']
        new_task['status'] = 'ready'
        new_task['temp_log'] = ''
        new_task['by'] = 'schedule'
        tasks[task_name] = new_task
        run_data = {}
        run_data['path'] = crawlers[new_task['crawler']]['path']
        run_data['spider'] = new_task['spider']
        run_data['file'] = task_name + '.json'
        run_data['parameters'] = new_task['parameters']
        run_data['options'] = new_task['options']
        run_data['options']['LOG_FILE'] = new_task['log']
        pid, log_setting = executor(run_data)
        tasks[task_name]['temp_log'] = log_setting['TEMP_LOG']
        tasks[task_name]['status'] = 'run'
        logs[task_name] = LogWatcher(log_setting['TEMP_LOG'])
        write_tasks()

@app.route('/data/<task_name>', methods=['GET'])
def get_data(task_name):
    global crawlers, tasks, schedules
    read_state()
    if task_name not in tasks:
        return json.dumps({'message': f'Task({task_name}) does not exist'}), 400
    if tasks[task_name]['status'] != 'finish':
        return json.dumps({'message': f'Task({task_name}) not finish'}), 400
    with open('./data/' + task_name + '.json', 'r', encoding='utf-8') as file:
        return file.read(), 200

def main():
    sch = scheduler()
    sch.start()
    app.run('0.0.0.0', port=5000, debug=False)

if __name__ == '__main__':
    main()