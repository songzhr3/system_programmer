
#include <unistd.h>
#include <sys/types.h>
#include <stdlib.h>
#include <signal.h>
#include <stdio.h>

//子进程个数
#define SUB_PRO_COUNT 10

//处理子进程的退出信号
void sub_quit_signal_handle(int sig);

//父进程的事件循环
void ParentCycle();

//子进程的事件循环
void ChildCycle();


int main(void)
{
	pid_t  pid;
	int i;

	//创建SUB_PRO_COUNT个子进程
	for(i=0; i<SUB_PRO_COUNT; i++)
	{
		pid = fork();
		if( 0 == pid || -1 == pid )
			break;
	}
	
	//创建子进程失败
	if( -1 == pid )
	{
		printf("No. %d: fork error\n", i);
	}

	//子进程的事件循环
	else if( 0 == pid )
	{
		ChildCycle();
	}

	//父进程的事件循环
	else
	{
		ParentCycle();
	}

	return 0;
}

 
void sub_quit_signal_handle(int sig)
{
	int status;

	//获取退出的那个子进程的状态
	int quit_pid = wait(&status);

	printf("sub process %d quit, exit status %d\n", quit_pid, status);

	//新创建一个子进程
	pid_t pid = fork();

	if( 0 == pid )
		 ChildCycle();
}

void ParentCycle()
{
	printf("Parent process %d\n", getpid());
	signal(SIGCHLD, sub_quit_signal_handle);
	while(1)
		pause();
}

void ChildCycle()
{
	printf("create sub process id: %d, parent id: %d\n", getpid(), getppid());
	while(1)
		pause();
}