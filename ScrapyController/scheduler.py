import threading
import json
import time
from datetime import datetime, timedelta

class scheduler(threading.Thread):
    def __init__(self):
        super().__init__()
        self.time_gap = 10
    
    def check_schedule(self):
        from main import SCHEDULE_FILE_PATH
        now = datetime.now()
        with open(SCHEDULE_FILE_PATH, 'r') as f:
            data = json.loads(f.read())
        slist = []
        for sch in data:
            cycle = data[sch]['cycle']
            target_days = data[sch]['day']
            target_times = data[sch]['time']
            if cycle == 'day':
                target_days = list(range(7))
                today = 0
            elif cycle == 'week':
                today = now.weekday()
            else: 
                today = now.day
            for target_day in target_days:
                if target_day == today:
                    for target_time in target_times:
                        dif = abs(3600 * now.hour + 60 * now.minute + now.second - int(target_time[:2])*3600-int(target_time[3:])*60)
                        if dif <= self.time_gap * 60 / 2:
                            slist.append(sch)
                            break
                    if sch in slist:
                        break
        return slist

    def run(self):
        now_time = datetime.now()
        minute_gap = self.time_gap - now_time.minute % self.time_gap
        next_waketime = now_time + timedelta(minutes=minute_gap)
        next_waketime = next_waketime.replace(second=0, microsecond=0)
        while True:
            print("Scheduler Sleep", self.native_id ,now_time, next_waketime)
            time.sleep(next_waketime.timestamp() - now_time.timestamp())
            now_time = datetime.now()
            next_waketime = now_time + timedelta(minutes=self.time_gap)
            next_waketime = next_waketime.replace(second=0, microsecond=0)
            from main import schedule_task
            schedule_task(self.check_schedule())