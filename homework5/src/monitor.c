#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <limits.h>
#include <fcntl.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>
#include <sys/stat.h>

void handle(int);
void ParentCycle();
void ChildCycle();

// void handler(int sig)
// {

// 	int status;
// 	//获取退出的那个子进程的状态
// 	int quit_pid = wait(&status);
// 	printf("sub process %d quit, exit status %d\n", quit_pid, status);

// 	//新创建一个子进程
// 	pid_t pid = fork();

// 	if( 0 == pid )
// 	{
// 		ChildCycle();
// 	}
// }

static void init()
{
	const char *fifoName = "/tmp/my_fifo";
	const int openMode = O_WRONLY;

	int pipeFd = -1;
	int res = 0;
	pid_t pid = 0;
	char buffer[PIPE_BUF + 1] = "init ok";

	if (-1 == access(fifoName, F_OK))
	{
		res = mkfifo(fifoName, 0777);
		if (0 != res)
		{
			fprintf(stderr, "could not create fifo\n");
			exit(EXIT_FAILURE);
		}
	}

	pid = getpid();
	printf("process %d opening fifo O_WRONLY\n", pid);

	pipeFd = open(fifoName, openMode);
	printf("pipeFd is %d\n", pipeFd);

	if (-1 != pipeFd)
	{
		printf("song\n");
		res = write(pipeFd, buffer, strlen(buffer));
		if (-1 == res)
		{
			fprintf(stderr, "write error\n");
			exit(EXIT_FAILURE);
		}

		close(pipeFd);
	}
	else
	{
		printf("zhan\n");
		exit(EXIT_FAILURE);
	}

	printf("process %d finished.\n",getpid());
    exit(EXIT_SUCCESS);
}

void handler(int sig)
{
	printf("this is a handler function\n");
	const char *fifoName = "/tmp/my_fifo";
	int pipeFd = -1;
	int res = 0;
	int openMode = O_RDONLY;
	char buffer[PIPE_BUF + 1];
	memset(buffer, '\0', sizeof(buffer));

	pid_t pid = getpid();
	printf("process %d opening FIFO O_RDONLY\n", pid);
	pipeFd = open(fifoName, openMode);

	printf("process %d result %d\n", getpid(), pipeFd);

	if (-1 != pipeFd)
	{
		do{
			res = read(pipeFd, buffer, PIPE_BUF);
			printf("buffer[%s]\n", buffer);

		}while (res > 0);

		close(pipeFd);
	}
	else
	{
		exit(EXIT_FAILURE);
	}

	printf("process %d finished\n", getpid());
	exit(EXIT_SUCCESS);
}

void ParentCycle()
{
	printf("Parent process %d\n", getpid());
	signal(SIGALRM, handler);
	alarm(5);

	while(1)
	{
		pause();
	}
}

void ChildCycle()
{
	printf("create sub process id: %d, parent id: %d\n", getpid(), getppid());
	init();
	while(1)
	{
		pause();
	}
}

int main()
{
	int count = 0;
	pid_t pid = 0;

	pid = fork();
	if (-1 != pid)
	{
		count++;
	}

	while (count < 5 && pid > 0)
	{
		pid = fork();
		if (-1 != pid)
		{
			count++;
		}
	}
	
	//创建子进程失败
	if( -1 == pid )
	{
		printf("fork error\n");
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

