源文件
//bestfit算法的内存管理器实现
memory_manager_bestfit.c

//firstfit算法的内存管理器实现
memory_manager_firstfit.c

//bestfit算法内存管理器的单元测试
cunit_test_memory_manager_bestfit.c

//firstfit算法内存管理器的单元测试
cunit_test_memory_manager_firstfit.c

头文件
memory_manager.h

测试：linux/centos 7 系统 在src路径下编译
// bestfit算法内存管理器的测试
[root@localhost src] # gcc -g memory_manager_bestfit.c -DTEST_MEMORY_MANAGER_BESTFIT -o test_memory_manager_bestfit.exe -Wall

// bestfit算法内存管理器的单元测试
[root@localhost src] # gcc -g memory_manager_bestfit.c cunit_test_memory_manager_bestfit.c -lcunit -o cunit_test_memory_manager_bestfit.exe  -Wall

// firstfit算法内存管理器的测试
[root@localhost src] # gcc -g memory_manager_firstfit.c -DTEST_MEMORY_MANAGER_FIRSTFIT -o test_memory_manager_firstfit.exe -Wall

// firstfit算法内存管理器的单元测试
[root@localhost src] # gcc -g memory_manager_firstfit.c cunit_test_memory_manager_firstfit.c -lcunit -o cunit_test_memory_manager_firstfit.exe  -Wall