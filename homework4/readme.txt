源文件
//关于链表功能的函数
DListNode.c

// 加锁解锁定义，多线程
locker_pthread.c

//队列测试/单元测试
test_queue.c
cunit_test_queue.c

// 哈希表测试/单元测试
test_hash_table
cunit_test_hash_table.c

测试：linux 系统 在src路径下编译
// 队列的测试
[root@localhost src] # gcc locker_pthread.c  test_queue.c  queue.c DListNode.c -g –o test_queue.exe -Wall

//哈希表的测试
[root@localhost src] # gcc locker_pthread.c  test_hash_table.c hash_table.c DListNode.c -g –o test_hash_table.exe -Wall

// 队列单元测试
[root@localhost src] # gcc locker_pthread.c  cunit_test_queue.c  queue.c DListNode.c -g –o cunit_test_queue.exe -lcunit

// 哈希表单元测试
[root@localhost src] # gcc locker_pthread.c  cunit_test_hash_table.c  hash_table.c DListNode.c -g –o cunit_test_hash_table.exe -lcunit