#include <iostream>
#include <vector>

using namespace std;

enum Gamemode {
    PVP,
    RAND_AI,
    BEST_MOVE_AI
};

class House;
class Row {
public:
    unsigned int houseNumber;
    unsigned int seedNumber;
    vector<House *> houses;
    House * storehouse;
    Row * nextRow;

    Row(unsigned int houseNumber, unsigned int seedNumber);

    Row * getNextRow();

    void setNextRow(Row * nextRow);

    House * getHouse(unsigned int n);

    friend ostream& operator<<(ostream& os, const Row& row);

    House * getStorehouse();

    bool startSeedAt(unsigned int houseNumber);

    House * getOppositeHouse(House * house);

    bool empty() const;

    unsigned int getTotal() const;
};
class Game;

class House {
    public:
        unsigned int seedNumber;
        House * next;
        Row * rowPtr;
        bool storehouse;

        House(unsigned int seedNumber, Row * rowPtr, bool storehouse):seedNumber(seedNumber), next(nullptr),
                                                                      rowPtr(rowPtr), storehouse(storehouse) {}

        void setNext(House * next) {
            this->next = next;
        }

        House * getNext() {
            return next;
        }

        friend ostream& operator<<(ostream& os, const House& house) {
            os << house.seedNumber;
            return os;
        }

       bool startSeed() {
            if (!this->storehouse) {
                if (seedNumber == 0) {
                    cout << "No seeds in that house!" << endl;
                    return true;
                }
                unsigned int temp = this->seedNumber;
                this->seedNumber = 0;
                return (*this->getNext()).seed(temp, this->rowPtr);
            }
            return false;
        }

        bool seed(unsigned int seeds, const Row * ogRow) {
            if (this->storehouse) {
                if (this->getRow() == ogRow) {
                    this->seedNumber++;
                    if (seeds == 1) {
                        return true;
                    }
                    else return (*this->getNext()).seed(--seeds, ogRow);
                }
                else return this->getNext()->seed(seeds, ogRow);
            }
            else {
                this->seedNumber++;
                if (seeds == 1) {
                    if (this->getRow() == ogRow && seedNumber == 1) {
                        rowPtr->getStorehouse()->addSeeds(this->getRow()->getOppositeHouse(this)->removeSeeds() + 1);
                        seedNumber = 0;
                    }
                    return false;
                }
                else return (*this->getNext()).seed(--seeds, ogRow);
            }
        }

        Row * getRow() const {
            return this->rowPtr;
        }

        void addSeeds(unsigned int seeds) {
            this->seedNumber += seeds;
        }

        unsigned int removeSeeds() {
            unsigned int temp = this->seedNumber;
            this->seedNumber = 0;
            return temp;
        }
};

/*
class Storehouse : public House {
    public:
        Storehouse(Row * rowPtr):House(0, rowPtr) {}

        void startSeed() {
            return;
        }

        void seed(unsigned int seeds, const Row * ogRow) {
            cout << this->getRow() << " " << ogRow << endl;
            if (this->getRow() == ogRow) House::seed(seeds, ogRow);
            else {
                cout << "Entered\n" << endl;
                (*this->getNext()).seed(seeds, ogRow);
            }
        }
};
*/


Row::Row(unsigned int houseNumber, unsigned int seedNumber):houseNumber(houseNumber), seedNumber(seedNumber) {
    for (int i = 0; i < this->houseNumber; i++) {
        houses.push_back(new House(this->seedNumber, this, false));
    }

    this->storehouse = new House(0, this, true);

    for (int i = 0; i < this->houseNumber - 1; i++) {
        this->houses[i]->setNext(houses[i + 1]);
    }

    this->houses[houseNumber - 1]->setNext(this->getStorehouse());
}

Row * Row::getNextRow() {
    return nextRow;
}

void Row::setNextRow(Row * nextRow) {
    this->nextRow = nextRow;
    this->getStorehouse()->setNext(this->nextRow->getHouse(0));
}

House * Row::getHouse(unsigned int n) {
    return houses[n];
}

ostream& operator<<(ostream& os, const Row& row) {
    for (int i = 0; i < row.houseNumber; i++) {
        os << *row.houses[i] << " ";
    }
    return os;
}

House * Row::getStorehouse() {
    return this->storehouse;
}

bool Row::startSeedAt(unsigned int houseNumber) {
    return this->houses[houseNumber - 1]->startSeed();
}

House * Row::getOppositeHouse(House * house) {
    unsigned int index = UINT_MAX;

    for (int i = 0; i < houseNumber; i++) {
        if (houses[i] == house) {
            index = i;
            break;
        }
    }

    if (index == UINT_MAX) return nullptr;

    return getNextRow()->getHouse(houseNumber - 1 - index);
}

bool Row::empty() const {
    for (int i = 0; i < houseNumber; i++) {
        if (houses[i]->seedNumber != 0) return false;
    }
    return true;
}

unsigned int Row::getTotal() const {
    unsigned int total = storehouse->seedNumber;
    for (int i = 0; i < houseNumber; i++) {
        total += houses[i]->seedNumber;
    }
    return total;
}

class Game {
    public:
        unsigned int houseNumber, seedNumber;
        Row * adversaryRow,* playerRow;
        Gamemode gamemode;

        Game(unsigned int houseNumber, unsigned int seedNumber, Gamemode gamemode) {
            this->houseNumber = houseNumber;
            this->seedNumber = seedNumber;
            this->gamemode = gamemode;

            this->adversaryRow = new Row(this->houseNumber, this->seedNumber);
            this->playerRow = new Row(this->houseNumber, this->seedNumber);

            this->adversaryRow->setNextRow(this->playerRow);
            this->playerRow->setNextRow(this->adversaryRow);
        }

        friend ostream& operator<<(ostream& os, const Game& game) {
            os << "\n\t";
            for (int i = game.houseNumber - 1; i >= 0; i--) {
                os << *game.adversaryRow->houses[i] << " ";
            }
            os << "\t\n";
            os << *game.adversaryRow->getStorehouse() << "\t\t\t" << *game.playerRow->getStorehouse() << endl;
            os << "\t";
            for (int i = 0; i < game.houseNumber; i++) {
                os << *game.playerRow->houses[i] << " ";
            }
            os << "\t\n\n";
            return os;
        }

        void play() {
            bool player = true;
            unsigned int house;
            while (!adversaryRow->empty() && !playerRow->empty()) {
                cout << *this;

                if (player) {
                    cout << "Player turn: ";
                    cin >> house;
                    cout << endl;

                    if (playerRow->startSeedAt(house)) continue;
                }
                else {
                    switch (this->gamemode)
                    {
                    case PVP:
                        cout << "Adversary turn: ";
                        cin >> house;
                        cout << endl;

                        break;
                    case RAND_AI:
                        house = rand() % this->houseNumber + 1;
                        cout << "Adversary turn: " << house << endl;

                        break;
                    case BEST_MOVE_AI:
                        break;
                    }
                    if (adversaryRow->startSeedAt(house)) continue;
                }

                player = !player;
            }
            if (playerRow->getTotal() > adversaryRow->getTotal()) {
                cout << "Player wins!" << endl;
            }
            else if (playerRow->getTotal() < adversaryRow->getTotal()) {
                cout << "Adversary wins!" << endl;
            }
            else cout << "Tie" << endl;
        }

        unsigned int calcBestMove() {
            
            for ()
        }
};

int main() {
    unsigned int houseNumber = 5, seedNumber = 5;

    cout << "Input houseNumber and seedNumber: ";
    cin >> houseNumber >> seedNumber;
    cout << endl;

    Game game(houseNumber, seedNumber, RAND_AI);

    game.play();

    return 0;
}