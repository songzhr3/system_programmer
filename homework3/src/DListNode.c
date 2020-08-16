// DListNode.c
#include <stdlib.h>
#include "../include/DListNode.h"


//通用双链表节点表示，数据域使用void*
typedef struct _DListNode
{
    struct _DListNode* prev;
    struct _DListNode* next;

    void* data;
}DListNode;

//通用双链表的开头使用一个DList结构体指针
//first指针指向链表的真正头节点
//data_destroy()，销毁链表节点的回调函数
//data_destroy_ctx，回调函数的传参
// Locker* 保存锁的结构体
struct _DList
{
    Locker* locker;
    DListNode* first;
    void* data_destroy_ctx;
    DListDataDestroyFunc data_destroy;
};

//销毁链表节点的data成员，调用回调函数销毁
static void _dlist_destroy_data(DList* thiz, void* data)
{
    if(thiz->data_destroy != NULL)
    {
        thiz->data_destroy(thiz->data_destroy_ctx, data);
    }

    return;
}

//创建一个数据域为data的链表节点
static DListNode* _dlist_create_node(DList* thiz, void* data)
{
    DListNode* node = malloc(sizeof(DListNode));

    if(node != NULL)
    {
        node->prev = NULL;
        node->next = NULL;
        node->data = data;
    }

    return node;
}

//通过index获取节点
static DListNode* _dlist_get_node(DList* thiz, size_t index, int fail_return_last)
{
    DListNode* iter = NULL;
    
    return_val_if_fail(thiz != NULL, NULL); 

    iter = thiz->first;

    while(iter != NULL && iter->next != NULL && index > 0)
    {
        iter = iter->next;
        index--;
    }

    if(!fail_return_last)
    {
        iter = index > 0 ? NULL : iter;
    }

    return iter;
}


//销毁链表节点node
static void _dlist_destroy_node(DList* thiz, DListNode* node)
{
    if(node != NULL)
    {
        node->next = NULL;
        node->prev = NULL;
        _dlist_destroy_data(thiz, node->data);
        SAFE_FREE(node);
    }

    return;
}

//内部获取链表长度，不加锁
static size_t  _dlist_length(DList* thiz)
{
    size_t length = 0;
    DListNode* iter = NULL;
    
    return_val_if_fail(thiz != NULL, 0);

    iter = thiz->first;

    while(iter != NULL)
    {
        length++;
        iter = iter->next;
    }

    return length;
}

// 链表加锁函数
static void _dlist_lock(DList* thiz)
{
    if(thiz->locker != NULL)
    {
        locker_lock(thiz->locker);
    }

    return;
}

// 链表解锁函数
static void _dlist_unlock(DList* thiz)
{
    if(thiz->locker != NULL)
    {
        locker_unlock(thiz->locker);
    }

    return;
}

//链表互斥锁销毁函数
static void _dlist_destroy_locker(DList* thiz)
{
    if(thiz->locker != NULL)
    {
        locker_unlock(thiz->locker);
        locker_destroy(thiz->locker);
    }

    return;
}

// 创建链表开头节点
DList* dlist_create(DListDataDestroyFunc data_destroy, void* ctx, Locker* locker)
{
    DList* thiz = malloc(sizeof(DList));

    if(thiz != NULL)
    {
        thiz->first  = NULL;
        thiz->locker = locker;
        thiz->data_destroy = data_destroy;
        thiz->data_destroy_ctx = ctx;
    }

    return thiz;
}
 
 
//插入节点
DListRet dlist_insert(DList* thiz, size_t index, void* data)
{
    DListRet ret = DLIST_RET_OK;
    DListNode* node = NULL;
    DListNode* cursor = NULL;

    return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS); 

    _dlist_lock(thiz);

    do
    {
        if((node = _dlist_create_node(thiz, data)) == NULL)
        {
            ret = DLIST_RET_OOM;
            break;
        }

        if(thiz->first == NULL)
        {
            thiz->first = node;
            break;
        }

        cursor = _dlist_get_node(thiz, index, 1);

        // _dlist_unlock(thiz);
        if(index < _dlist_length(thiz))
        {
            node->next = cursor;
            if(cursor->prev != NULL)
            {
                cursor->prev->next = node;
            }
            cursor->prev = node;
            if(thiz->first == cursor)
            {
                thiz->first = node;
            }
        }
        else
        {
            cursor->next = node;
            node->prev = cursor;
        }
        // _dlist_lock(thiz);
    }while(0);

    _dlist_unlock(thiz);

    return ret;
}


//头插法插入节点
DListRet dlist_prepend(DList* thiz, void* data)
{
    return dlist_insert(thiz, 0, data);
}


//尾插法插入节点
DListRet dlist_append(DList* thiz, void* data)
{
    return dlist_insert(thiz, -1, data);
}

//删除节点
DListRet dlist_delete(DList* thiz, size_t index)
{
    DListRet ret = DLIST_RET_OK;
    DListNode* cursor = NULL;

    return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS); 
    
    _dlist_lock(thiz);
    cursor = _dlist_get_node(thiz, index, 0);

    do
    {
        if(cursor == NULL)
        {
            ret = DLIST_RET_PARAMS;
            break;
        }

        if(cursor != NULL)
        {
            if(cursor == thiz->first)
            {
                thiz->first = cursor->next;
            }

            if(cursor->next != NULL)
            {
                cursor->next->prev = cursor->prev;
            }

            if(cursor->prev != NULL)
            {
                cursor->prev->next = cursor->next;
            }

            _dlist_destroy_node(thiz, cursor);
        }

    }while(0);

    _dlist_unlock(thiz);

    return ret;
}

//通过index获取节点
DListRet dlist_get_by_index(DList* thiz, size_t index, void** data)
{
    DListNode* cursor = NULL;

    return_val_if_fail(thiz != NULL && data != NULL, DLIST_RET_PARAMS); 

    _dlist_lock(thiz);

    cursor = _dlist_get_node(thiz, index, 0);

    if(cursor != NULL)
    {
        *data = cursor->data;
    }
    _dlist_unlock(thiz);

    return cursor != NULL ? DLIST_RET_OK : DLIST_RET_PARAMS;
}
 
//通过index设置链表节点
DListRet dlist_set_by_index(DList* thiz, size_t index, void* data)
{
    DListNode* cursor = NULL;

    return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS);

    _dlist_lock(thiz);
    
    cursor = _dlist_get_node(thiz, index, 0);

    if(cursor != NULL)
    {
        cursor->data = data;
    }

    _dlist_unlock(thiz);

    return cursor != NULL ? DLIST_RET_OK : DLIST_RET_PARAMS;
}


//获取链表长度
size_t   dlist_length(DList* thiz)
{
    size_t length = 0;
    DListNode* iter = NULL;
    
    return_val_if_fail(thiz != NULL, 0);

    _dlist_lock(thiz);

    iter = thiz->first;

    while(iter != NULL)
    {
        length++;
        iter = iter->next;
    }

    _dlist_unlock(thiz);

    return length;
}

//查找目标数据所在的节点，返回index
//参数是比较函数（回调函数的形式）以及回调函数的参数
int dlist_find(DList* thiz, FindCompareFunc cmp, void* ctx)
{
    int i = 0;
    DListNode* iter = NULL;

    return_val_if_fail(thiz != NULL && cmp != NULL, -1);

    _dlist_lock(thiz);

    iter = thiz->first;
    while(iter != NULL)
    {
        if(cmp(ctx, iter->data) == 0)
        {
            break;
        }
        i++;
        iter = iter->next;
    }

    _dlist_unlock(thiz);

    return i;
}

//链表遍历函数，参数使用回调函数形式
DListRet dlist_foreach(DList* thiz, DListDataVisitFunc visit, void* ctx)
{
    DListRet ret = DLIST_RET_OK;
    DListNode* iter = NULL;
    
    return_val_if_fail(thiz != NULL && visit != NULL, DLIST_RET_PARAMS);

    _dlist_lock(thiz);

    iter = thiz->first;

    while(iter != NULL && ret != DLIST_RET_STOP)
    {
        ret = visit(ctx, iter->data);

        iter = iter->next;
    }
    _dlist_unlock(thiz);

    return ret;
}


//销毁整个链表
void dlist_destroy(DList* thiz)
{
    DListNode* iter = NULL;
    DListNode* next = NULL;
    
    return_if_fail(thiz != NULL);

    _dlist_lock(thiz);

    iter = thiz->first;
    while(iter != NULL)
    {
        next = iter->next;
        _dlist_destroy_node(thiz, iter);
        iter = next;
    }

    thiz->first = NULL;
    _dlist_destroy_locker(thiz);
    
    SAFE_FREE(thiz);
    
    return;
}

//选择排序算法
//比较函数使用回调函数的方法
//decend参数指示升序/降序的排序方式
DListRet dlist_select_sort(DList* thiz, DListDataCompareFunc myCompare, void* ctx, bool decend)
{
	DListRet ret = DLIST_RET_OK;
	bool result = false;
    DListNode* cur = thiz->first;

    return_val_if_fail(thiz != NULL && myCompare != NULL, -1);

    _dlist_lock(thiz);

	while (cur != NULL)
	{
		DListNode* cur_next = cur->next;
		while (cur_next != NULL)
		{
			result = myCompare(cur->data, decend, cur_next->data);
			if (result)
			{
				void* tmp = cur->data;
				cur->data = cur_next->data;
				cur_next->data = tmp;
			}
			cur_next = cur_next->next;
		}
		
		cur = cur->next;
	}

    _dlist_unlock(thiz);
	return ret;
}

//冒泡排序算法
//比较函数使用回调函数的方法
//decend参数指示升序/降序的排序方式
DListRet dlist_bubble_sort(DList* thiz, DListDataCompareFunc myCompare, void* ctx, bool decend)
{
	DListRet ret = DLIST_RET_OK;
	bool result = false;
	DListNode* cur;
	DListNode* cur_next;
    return_val_if_fail(thiz != NULL && myCompare != NULL, -1);

    _dlist_lock(thiz);

	size_t length = _dlist_length(thiz);
	int i, j;
	for (i = 0; i < length - 1; i++)
	{
		cur = thiz->first;
		cur_next = cur->next;
		for (j = 0; j < length - i - 1; j++)
		{
			result = myCompare(cur->data, decend, cur_next->data);
			if (result)
			{
				void* tmp = cur->data;
				cur->data = cur_next->data;
				cur_next->data = tmp;
			}
			cur = cur->next;
			cur_next = cur->next;
		}
	}

    _dlist_unlock(thiz);
    return ret;
}
