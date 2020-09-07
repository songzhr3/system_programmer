#include<wait.h>
#include<stdio.h>
#include<sys/types.h>

int main()
{
    pid_t pid = fork();
    int stat = 0;
    switch(pid)
    {
        case -1:
            perror("fork failed");
            exit(1);
            break;
        case 0:
            printf("\n");
            execlp("ps","ps","au",0);
            break;
        default:
            do
            {
                pid = waitpid(pid,&stat,WNOHANG);
                if(pid==0)
                {
                    printf("parent do something else.\n");
                    sleep(1);
                }
            }while(pid==0);
            printf("Child has finished:PID=%d\n",pid);
            printf("parent,ps done\n");
            break;
    }
    exit(0);
}