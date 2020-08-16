//producer_consumer.h

#ifndef __PRODUCER_CONSUMER_H__
#define __PRODUCER_CONSUMER_H__

//用c语言的方式编译
#ifdef __cplusplus
extern "C"{
#endif /* _cplusplus */


// 供主函数调用的测试函数
// 单线程版本测试
void single_thread_test(void);

// 多线程版本测试
void multi_thread_test(void);

#ifdef __cplusplus
}
#endif /* _cplusplus */

#endif /* __PRODUCER_CONSUMER_H__ */
