// test_queue.c
#include <assert.h>
#include "../include/DListNode.h"
#include "../include/queue.h"

#define N_QUEUE 10

static DListRet print_int(void* ctx, void* data)
{
	printf("%d ", *(int*)data);

	return DLIST_RET_OK;
}

int main(int argc, char* argv[])
{
	int i = 0;
	int data = 0;
	int *pdata = &data;
	int nums[N_QUEUE];
	for (i = 0; i < N_QUEUE; i++)
	{
		nums[i] = i;
	}

	Queue* queue = queue_create(NULL, NULL);		

	for(i = 0; i < N_QUEUE; i++)
	{
		assert(queue_push(queue, &nums[i]) == DLIST_RET_OK);
		assert(queue_head(queue, (void**)&pdata) == DLIST_RET_OK);
		assert(queue_length(queue) == (i+1));
	}

	queue_foreach(queue, print_int, NULL);
	printf("\n");

	for(i = 0; i < N_QUEUE; i++)
	{
		assert(queue_head(queue, (void**)&pdata) == DLIST_RET_OK);
		assert(queue_length(queue) == (N_QUEUE - i));
		assert(queue_pop(queue) == DLIST_RET_OK);
		queue_foreach(queue, print_int, NULL);
		printf("\n");
	}

	queue_destroy(queue);
	return 0;
}
