# _*_ coding: utf-8 _*_
import logging
import os.path
import time
import os


def getlog(logger_name):
    import logging
    logger = logging.getLogger(logger_name)
    logger.setLevel(level = logging.INFO)

    rq = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    log_path = os.path.split(os.path.realpath(__file__))[0] + '/logs/'
    log_name = log_path + rq + '.log'

    # 文件句柄 用于写入文件日志
    file_handler = logging.FileHandler(log_name)
    file_handler.setLevel(logging.INFO)
    
    # 控制台句柄， 在控制台输出日志
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # 定义 handler 输出格式
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # 给logger 添加handler
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger