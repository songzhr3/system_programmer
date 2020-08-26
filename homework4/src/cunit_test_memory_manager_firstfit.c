/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    cunit_test_memory_manager.c
 *\brief   Unit test for memory_manager_bestfit.c.
 *\details 
 *
 *\author  Song Zhanren
 *\version 1.0.0
 *\date	   24Aug20
 *
 *\warning
 *
 *\history \
 *
 *
 */
/**************************************************************************************************/
/*											CONFIGURATIONS										  */
/**************************************************************************************************/
	
/**************************************************************************************************/
/*											INCLUDE_FILES										  */
/**************************************************************************************************/
#include <stdio.h>
#include <assert.h>
#include <CUnit/Basic.h>
#include <CUnit/Console.h>
#include <CUnit/Automated.h>
#include <CUnit/CUnit.h>
#include <CUnit/TestDB.h>
#include "../include/memory_manager.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/
typedef struct _PrivInfo
{
	DListNode* dlist;           /* 指向空闲链表的第一个节点*/
}PrivInfo;

/**************************************************************************************************/
/*                                          EXTERN_PROTOTYPES                                     */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          LOCAL_PROTOTYPES                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          VARIABLES                                             */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          LOCAL_FUNCTIONS                                       */
/**************************************************************************************************/

/* 
* unit test for memory_manager_create()
*/
void test_memory_manager_create()
{
	/* 
	* buffer == NULL
	*/
	Memory_Manager* memory_manager = memory_manager_create(NULL, MIN_SIZE);
	CU_ASSERT_PTR_NULL(memory_manager);

	char buffer[1024];
	memory_manager = memory_manager_create(buffer, MIN_SIZE - 1);
	CU_ASSERT_PTR_NULL(memory_manager);
	
	/* 
	* normal parameters
	*/
	memory_manager = memory_manager_create(buffer, sizeof(buffer));
	CU_ASSERT_PTR_NOT_NULL(memory_manager);
}

/* 
* 打印内存管理器中空闲链表中的空闲内存块编号、起始地址以及内存大小
*/
static void memory_manager_print(Memory_Manager* thiz)
{
	int index = 0;
	DListNode* iter = NULL;
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	return_if_fail(NULL != thiz);

	for (iter = priv->dlist; NULL != iter; iter = iter->next, index++)
	{
		printf("[%d] %p %ld\n", index, iter, iter->length);
	}

	return;
}

/* 
* unit test for memory_manager_alloc()
*/
void test_memory_manager_alloc() 
{
	char buffer[1024];
	char* ptrs[5] = {0};
	int i = 0;

	Memory_Manager* memory_manager = memory_manager_create(buffer, sizeof(buffer));
	CU_ASSERT_PTR_NOT_NULL(memory_manager);

	char* ptr = memory_manager_alloc(NULL, MIN_SIZE);
	CU_ASSERT_PTR_NULL(ptr);

	memory_manager_print(memory_manager);
	
	for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	{
		ptrs[i] = memory_manager_alloc(memory_manager, 100 * (i+1));

		if (i < 3)
		{
			CU_ASSERT_PTR_NOT_NULL(ptrs[i]);
		}
		else
		{
			CU_ASSERT_PTR_NULL(ptrs[i]);
		}
		// memory_manager_print(memory_manager);
	}

	printf("\n");

	for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	{
		memory_manager_free(memory_manager, ptrs[i]);
		ptrs[i] = NULL;
		// memory_manager_print(memory_manager);
	}
}

/* 
* unit test for memory_manager_free()
*/
void test_memory_manager_free()  // Memory_Manager* thiz, void* ptr
{
	char buffer[1024];
	char* ptrs[5] = {0};
	int i = 0;

	Memory_Manager* memory_manager = memory_manager_create(buffer, sizeof(buffer));
	CU_ASSERT_PTR_NOT_NULL(memory_manager);

	// memory_manager_print(memory_manager);
	
	for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	{
		ptrs[i] = memory_manager_alloc(memory_manager, 100 * (i+1));

		if (i < 3)
		{
			CU_ASSERT_PTR_NOT_NULL(ptrs[i]);
		}
		else
		{
			CU_ASSERT_PTR_NULL(ptrs[i]);
		}
		// memory_manager_print(memory_manager);
	}

	memory_manager_free(memory_manager, NULL);
	for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	{
		memory_manager_free(NULL, ptrs[i]);
	}
	
	printf("\n");

	for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	{
		memory_manager_free(memory_manager, ptrs[i]);
		ptrs[i] = NULL;
		// memory_manager_print(memory_manager);
	}
}


/* 
* unit test for memory_manager_destroy()
*/
void test_memory_manager_destroy()
{
	// thiz = NULL
	Memory_Manager* memory_manager = NULL;
	memory_manager_destroy(&memory_manager);
	CU_ASSERT_PTR_NULL(memory_manager);

	char buffer[1024];

	memory_manager = memory_manager_create(buffer, sizeof(buffer));	
	CU_ASSERT_PTR_NOT_NULL(memory_manager);
	
	// destroy memory_manager
	memory_manager_destroy(&memory_manager);
	CU_ASSERT_PTR_NULL(memory_manager);
}

/* 
* suite init function
*/
int suite_success_init(void)
{
	return 0;
}

/* 
* suite clean function
*/
int suite_success_clean(void)
{
	return 0;
}

CU_TestInfo test_memory_manager_case[] = 
{
	{"test_memory_manager_create", test_memory_manager_create},
	{"test_memory_manager_alloc", test_memory_manager_alloc},
	{"test_memory_manager_free", test_memory_manager_free},
	{"test_memory_manager_destroy", test_memory_manager_destroy},
	CU_TEST_INFO_NULL
};

CU_SuiteInfo suites[] = 
{
	{"test_memory_manager_case", suite_success_init, suite_success_clean, NULL, NULL, test_memory_manager_case},
	CU_SUITE_INFO_NULL
};

/* 
* test function
*/
int run_test()
{
	/* 
	* initialize the CUnit test registry
	*/
	if (CUE_SUCCESS != CU_initialize_registry())
	{
		return CU_get_error();
	}
	
	if (CUE_SUCCESS != CU_register_suites(suites))
	{
		CU_cleanup_registry();
		return CU_get_error();
	}
	
    /* 
    * Automated Mode 
    */
    // CU_set_output_filename("TestMax");
    // CU_list_tests_to_file();
    // CU_automated_run_tests();
    
    /* 
    * Basice Mode 
    */
    CU_basic_set_mode(CU_BRM_VERBOSE);
    CU_basic_run_tests();
   
    /* 
    * Console Mode  
    */
    // CU_console_run_tests();
    
    /* 
    * registry clean
    */
	CU_cleanup_registry();
	
	return CU_get_error();
}

/* 
* main function
*/
int main(int argv, char* argc[])
{
	return run_test();
}

/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/