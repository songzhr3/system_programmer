#include <assert.h>
#include "../include/memory_manager.h"

// static void memory_manager_dump(Memory_Manager* thiz)
// {
// 	int index = 0;
// 	DListNode* iter = NULL;
// 	PrivInfo* priv = (PrivInfo*)thiz->priv;

// 	return_if_fail(NULL != thiz);

// 	for (iter = priv->dlist; NULL != iter; iter = iter->next, index++)
// 	{
// 		printf("[%d] %p %ld\n", index, iter, iter->length);
// 	}

// 	return;
// }

int main()
{
	char buffer[1024];

	Memory_Manager* memory_manager = memory_manager_create(buffer, sizeof(buffer));

	printf("this line is ok.\n");
	int index = 0;

	char* ptr = memory_manager_alloc(memory_manager, 100);
	PrivInfo* priv = (PrivInfo*)memory_manager->priv;
	printf("[%d] %p %ld\n", index, priv->dlist, priv->dlist->length);

	getchar();
	return 0;
}