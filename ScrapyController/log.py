import regex as re
from stats import Stats
from datetime import datetime

class Log:
    def __init__(self, log_str:str):
        log_part = log_str.split()
        self.Time = datetime.fromisoformat(log_part[0] + 'T' + log_part[1])
        self.Location = log_part[2][1:-1]
        self.Level = log_part[3][:-1]
        self.MSG = ' '.join(log_part[4:])
        self.Content = ''
    
    def __str__(self):
        return f'{self.Time} [{self.Location}] {self.Level}: {self.MSG}\n{self.Content}'
    
    def add_content(self, content):
        self.Content += '\n' + content

def isLog(string):
    return len(string) > 10 and string[4] == '-' and string[7] == '-'

def LogParser(log_str):
    logList = []
    if log_str == '':
        return []
    for line in log_str.split('\n'):
        if isLog(line):
            logList.append(Log(line))
        else:
            logList[-1].add_content(line)
    return logList

class LogWatcher:
    def __init__(self, log_file: str):
        self.file = open(log_file, 'r', encoding='utf-8')
        self.stat = Stats()
    def get_log(self):
        new_log = self.file.read()
        return LogParser(new_log)
    def get_stat(self):
        log_list = self.get_log()
        for log in log_list:
            self.stat.log_count[log.Level] += 1
            self.stat.lastlog_time = log.Time
            if re.match('Scrapy.+started', log.MSG) is not None:
                self.stat.start_time = log.Time
                self.stat.status = 'RUN'
            if re.match('Spider closed', log.MSG) is not None:
                self.stat.finish_time = log.Time
                self.stat.status = 'FIN'
            if re.match('Scraped from', log.MSG) is not None:
                self.stat.item_count += 1
            if re.match('Crawled \([0-9]*\)', log.MSG) is not None:
                status_code = re.search('\([0-9]{3}\)', log.MSG)[0][1:-1]
                if status_code not in self.stat.res_count:
                    self.stat.res_count[status_code] = 1
                else :
                    self.stat.res_count[status_code] += 1
            if log.Level == 'ERROR':
                error_type = log.Content.split('\n')[-1]
                error_type = error_type[:error_type.find(':')]
                if error_type not in self.stat.err_count:
                    self.stat.err_count[error_type] = [log.Content]
                else :
                    self.stat.err_count[error_type].append(log.Content)
        return self.stat

if __name__ == '__main__':
    x = LogWatcher('err.log')
    print(x.get_stat())