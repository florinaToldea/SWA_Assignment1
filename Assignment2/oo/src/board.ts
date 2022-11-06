/* Generates the next abvailable pieces after the swaped ones have been removed. */
export type Generator<T> = { next: () => T };

export type Position = {
  row: number;
  col: number;
};

export type Piece<T> = {
  value: T;
  position: Position;
};

export enum CHECK_DIRECTION {
  RIGHT = "Right",
  LEFT = "Left",
  TOP = "Top",
  DOWN = "Down",
}

export type Match<T> = {
  matched: T;
  positions: Position[];
};

export type BoardEvent<T> = {
  kind: "Match" | "Refill";
  match?: Match<T>;
};

export type BoardListener<T> = (event: BoardEvent<T>) => void;

export class Board<T> {
  width: number;
  height: number;

  listeners: BoardListener<T>[] = [];
  generator: Generator<T>;
  pieces: Piece<T>[] = [];
  enabeledEvents: boolean = false;

  constructor(columns: number, rows: number, generator: Generator<T>) {
    this.width = columns;
    this.height = rows;
    this.generator = generator;
  }

  addListener(listener: BoardListener<T>) {
    this.listeners.push(listener);
  }

  piece(p: Position): T | undefined {
    if (!this.is_Piece_Outside_Board(p)) {
      return undefined;
    }
    return this.find_Piece_On_Given_Position(p).value;
  }

  canMove(first: Position, second: Position): boolean {
    return this.able_To_Move(first, second);
  }

  move(first: Position, second: Position): boolean {
    if (this.able_To_Move(first, second)) {
      this.enabeledEvents = true;
      this.swapPieces(first, second);
      this.boardScan();
      this.enabeledEvents = false;
    }
    return null;
  }

  /* Method for checking is the piece is inside the board or not. */
  is_Piece_Outside_Board(p: Position): boolean {
    if (p.col >= this.width || p.col < 0) {
      return false;
    }

    if (p.row >= this.height || p.row < 0) {
      return false;
    }

    return true;
  }

  /* Method for finding a piece on a given position. */
  find_Piece_On_Given_Position(position: Position) {
    return this.pieces.find((element) => {
      return (
        element.position.row == position.col &&
        element.position.row == element.position.row
      );
    });
  }

  /* Method for checking if you can make a move or not. */

  able_To_Move(first: Position, second: Position): boolean {
    if (
      !this.is_Piece_Outside_Board(first) ||
      !this.is_Piece_Outside_Board(second)
    ) {
      return false;
    }

    if (first.col == second.col && first.row == second.row) {
      return false;
    }

    if (first.col != second.col && first.row != second.row) {
      return false;
    }

    this.swapPieces(first, second);
    const matches_in_row = this.row_Matches();
    const matches_in_column = this.column_Matches();
    this.swapPieces(first, second);

    if (!matches_in_row.length && !matches_in_column.length) {
      return false;
    }
    return true;
  }

  /* Method for swapping the pieces. */
  swapPieces(first: Position, second: Position) {
    const first_piece = this.find_Piece_On_Given_Position(first);
    const second_piece = this.find_Piece_On_Given_Position(second);
    const first_piece_value = first_piece.value;
    const second_piece_value = second_piece.value;
    const first_index = this.pieces.indexOf(first_piece);
    const second_index = this.pieces.indexOf(second_piece);

    this.pieces[first_index].value = second_piece_value;
    this.pieces[second_index].value = first_piece_value;
  }

  /* Method for all matches - row */
  row_Matches() {
    let matches: Piece<T>[] = [];
    for (let i = 0; i < this.height; i++) {
      const checking: T[] = [];
      const elements = this.get_All_Pieces_In_Row(i);

      for (const element of elements) {
        if (!checking.includes(element.value)) {
          checking.push(element.value);
          matches = matches.concat(
            this.row_inDepth_Equal_Pieces_Check(element)
          );
        }
      }
    }
    return matches;
  }

  /* Method for getting all pieces from a given row. */
  get_All_Pieces_In_Row(row_index: number) {
    return this.pieces.filter((element) => {
      return element.position.row == row_index;
    });
  }

  /* Method for searching more in depth for how many same pieces there are as the first one(one to start from). */
  row_inDepth_Equal_Pieces_Check(startPiece: Piece<T>) {
    const left_pieces = this.neighbour_Value_Check(
      this.find_Piece_On_Given_Position(
        this.find_Next_Piece_On_Given_Position(startPiece, CHECK_DIRECTION.LEFT)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.LEFT
    );
    const rightSidePieces = this.neighbour_Value_Check(
      this.find_Piece_On_Given_Position(
        this.find_Next_Piece_On_Given_Position(
          startPiece,
          CHECK_DIRECTION.RIGHT
        )
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.RIGHT
    );

    if (left_pieces.length + rightSidePieces.length + 1 >= 3) {
      const matchingPieces = [...left_pieces, ...rightSidePieces, startPiece];

      if (this.enabeledEvents) {
        const matchingPositions = matchingPieces
          .sort((a, b) => (a.position.col > b.position.col ? 1 : -1))
          .map((match) => match.position);

        this.listeners.forEach((listener) => {
          listener({
            kind: `Match`,
            match: {
              matched: { ...matchingPieces[0] }.value,
              positions: matchingPositions,
            },
          });
        });
      }
      return matchingPieces;
    }
    return [];
  }

  /* Method for checking the same valued neighbours of a given piece. */
  neighbour_Value_Check(
    chosenPiece: Piece<T>,
    matchingPiece: Piece<T>[],
    value: T,
    checkDirection: CHECK_DIRECTION
  ): Piece<T>[] {
    if (!chosenPiece) {
      return matchingPiece;
    }

    if (chosenPiece.value == value) {
      matchingPiece.push(chosenPiece);
      const nextPiece = this.find_Piece_On_Given_Position(
        this.find_Next_Piece_On_Given_Position(chosenPiece, checkDirection)
      );
    }
    return matchingPiece;
  }

  /* Method for finding the position for the next piece based on the given piece and the given direction. */
  find_Next_Piece_On_Given_Position(
    currentPiece: Piece<T>,
    direction: CHECK_DIRECTION
  ): Position {
    let position: Position = {
      col: currentPiece.position.col,
      row: currentPiece.position.row,
    };

    if (direction == CHECK_DIRECTION.RIGHT) {
      position.col += 1;
    }

    if (direction == CHECK_DIRECTION.TOP) {
      position.row -= 1;
    }

    if (direction == CHECK_DIRECTION.LEFT) {
      position.col -= 1;
    }

    if (direction == CHECK_DIRECTION.DOWN) {
      position.row += 1;
    }
    return position;
  }

  /* Method for all matches - column */
  column_Matches() {
    let matches: Piece<T>[] = [];

    for (let i = this.width; i >= 0; i--) {
      const checkedValues: T[] = [];
      const elementsInColumn = this.get_All_Pieces_In_Column(i);

      for (const element of elementsInColumn) {
        if (!checkedValues.includes(element.value)) {
          checkedValues.push(element.value);
          matches = matches.concat(
            this.column_inDepth_Equal_Pieces_Check(element)
          );
        }
      }
    }
    return matches;
  }

  /* Method for getting all pieces from a given column. */
  get_All_Pieces_In_Column(index: number): Piece<T>[] {
    return this.pieces.filter((element) => {
      return element.position.col == index;
    });
  }

  /* Method for searching more in depth for how many same pieces there are as the first one(one to start from). */
  column_inDepth_Equal_Pieces_Check(startPiece: Piece<T>) {
    const firstTopPiece = this.find_Next_Piece_On_Given_Position(
      startPiece,
      CHECK_DIRECTION.TOP
    );
    const secondTopPiece = this.find_Piece_On_Given_Position(firstTopPiece);
    const topTopPieces = this.neighbour_Value_Check_Column(
      secondTopPiece,
      [],
      startPiece.value,
      CHECK_DIRECTION.TOP
    );
    const downPiece = this.neighbour_Value_Check_Column(
      this.find_Piece_On_Given_Position(
        this.find_Next_Piece_On_Given_Position(startPiece, CHECK_DIRECTION.DOWN)
      ),
      [],
      startPiece.value,
      CHECK_DIRECTION.DOWN
    );

    if (topTopPieces.length + downPiece.length + 1 >= 3) {
      const matched_ = [...topTopPieces, ...downPiece, startPiece];
      if (this.enabeledEvents) {
        this.listeners.forEach((listener) => {
          listener({
            kind: `Match`,
            match: {
              matched: { ...matched_[0] }.value,
              positions: matched_
                .sort((a, b) => (a.position.row > b.position.row ? 1 : -1))
                .map((match) => match.position),
            },
          });
        });
      }
      return matched_;
    }
    return [];
  }

  /* Method for checking the same valued neighbours of a given piece.  */
  neighbour_Value_Check_Column(
    currentPiece: Piece<T>,
    matchingPiece: Piece<T>[],
    value: T,
    checkDirection: CHECK_DIRECTION
  ) {
    if (!currentPiece) {
      return matchingPiece;
    }

    if (currentPiece.value == value) {
      matchingPiece.push(currentPiece);

      const nextPiece = this.find_Piece_On_Given_Position(
        this.find_Next_Piece_On_Given_Position(currentPiece, checkDirection)
      );
      this.neighbour_Value_Check_Column(
        nextPiece,
        matchingPiece,
        value,
        checkDirection
      );
    }
    return matchingPiece;
  }

  /* Method for scanning the board for matches. */
  boardScan() {
    const rowMatches = this.get_All_Matches_Row();
    const columnMatches = this.get_All_Matches_Column();

    if (columnMatches.length || rowMatches.length) {
      this.matched_Values_Removal(rowMatches, columnMatches);
      this.refillBoard();
    }
  }

  matched_Values_Removal(
    matchRows: Piece<T>[],
    matchColumns: Piece<T>[]
  ): void {
    matchRows.forEach((match) => {
      match.value = undefined;
    });

    matchColumns.forEach((match) => {
      match.value = undefined;
    });
  }

  /* Method for getting all macthes in a row. */
  get_All_Matches_Row() {
    let matches: Piece<T>[] = [];

    for (let i = 0; i < this.height; i++) {
      const checked: T[] = [];
      const elements = this.get_All_Pieces_In_Row(i);

      for (const element of elements) {
        if (!checked.includes(element.value)) {
          checked.push(element.value);
          matches = matches.concat(
            this.row_inDepth_Equal_Pieces_Check(element)
          );
        }
      }
    }
    return matches;
  }

  /* Method for getting all matches in column. */
  get_All_Matches_Column() {
    let matches: Piece<T>[] = [];

    for (let i = this.width; i >= 0; i--) {
      const checked: T[] = [];
      const elementsInColumn = this.get_All_Pieces_In_Column(i);

      for (const elemnt of elementsInColumn) {
        if (!checked.includes(elemnt.value)) {
          checked.push(elemnt.value);
          matches = matches.concat(
            this.column_inDepth_Equal_Pieces_Check(elemnt)
          );
        }
      }
    }
    return matches;
  }

  /* Method for scanning the board again to see if new matches appear (Recursion).
   * It calls a refill event and goes from left to right row by row.
   * When the empty piece is found it shifts all pieces above and put a new one on the top of the column. */
  refillBoard(): void {
    this.listeners.forEach((listener) => {
      listener({
        kind: `Refill`,
      });
    });

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const its_a_Match = this.find_Piece_On_Given_Position({ row, col });
        if (its_a_Match.value == undefined) {
          this.interchange_Elements_In_Columns(
            its_a_Match.position.row,
            its_a_Match.position.col
          );
          this.find_Piece_On_Given_Position({
            row: 0,
            col: its_a_Match.position.col,
          }).value = this.generator.next();
        }
      }
    }
    this.boardScan();
  }

  /* Method for interchanging elements one by one in the chosen column from bottom to top until the end of the board, starting from the given row. */
  interchange_Elements_In_Columns(startRow: number, col: number): void {
    for (let row = startRow; row > 0; row--) {
      this.swapPieces({ row, col }, { row: row - 1, col });
    }
  }
}
