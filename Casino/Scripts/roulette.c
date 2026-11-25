#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <stdbool.h>

typedef struct {
    int num;
    const char* color;
} Number;

const char* get_color(int i) {
    if (i == 0) {
        return "grn";
    }
    else if (i % 2 == 0) {
        if (i <= 10 || (i > 18 && i <= 28)) {
            return "blk";
        }
        return "red";
    }
    else {
        if (i >= 28 || (i > 10 && i <= 18)) {
            return "red";
        }
        return "blk";
    }
}

void generate_table(Number *table) {
    for (int i = 0; i < 37; i++) {
	const char* color = get_color(i);
        table[i].num = i;
        table[i].color = color;
    }
}

int main(void) {
    int guess = 0;
    int balance = 10;
    int bet_size = 0;
    Number table[37];

    srand(time(NULL));
    generate_table(table);
    while (true) {
        printf("Balance: %d\n", balance);
	printf("Enter your guess: ");
	scanf("%d", &guess);
	printf("Enter your bet size: ");
	scanf("%d", &bet_size);
	while (bet_size > balance) {
	    printf("Insufficient funds\nEnter your bet size: ");
	    scanf("%d", &bet_size);
	}

	int spin = (rand() % 37) + 1;

	printf("SPIN: %d\nCOLOR: %s\n", table[spin].num, table[spin].color);

	if (guess == spin) {
	    printf("WIN\n");
	    balance += bet_size * 2;
	}
	else {
	    printf("LOSE\n");
            balance -= bet_size;
	    if (balance == 0) {
		break;
	    }
        }
    }

    return 0;
}
