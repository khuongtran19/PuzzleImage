class game {
    constructor() {
        this.init();
        this.loadImage();
        this.loop();
        this.listenMouseEvent();
    }

    init() {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.img = null;
        this.pieces = [];

        this.selectedPiece = {};
        this.emptyPiece = { row: 0, col: 0 }

        document.body.appendChild(this.canvas)
    }

    loadImage() {
        this.img = new Image();
        this.img.onload = () => {
            this.startGame();
        }
        this.img.src = 'eagle.jpg'
    }

    listenMouseEvent() {
        this.canvas.addEventListener('mousedown', (evt) => this.mousedown(evt))
        this.canvas.addEventListener('mouseup', (evt) => this.mouseup(evt))
    }
    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect()
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
    }

    getCordinateByMousePosistion(mousePos) {
        return {
            col: Math.floor(mousePos.x / PIECE_SIZE),
            row: Math.floor(mousePos.y / PIECE_SIZE)
        }
    }
    mousedown(evt) {
        let mousePos = this.getMousePos(evt)
        this.selectedPiece = this.getCordinateByMousePosistion(mousePos)
    }

    mouseup(evt) {
        let mousePos = this.getMousePos(evt);
        let mouseUpCor = this.getCordinateByMousePosistion(mousePos)
        if (
            mouseUpCor.row != this.emptyPiece.row ||
            mouseUpCor.col != this.emptyPiece.col
        ) {
            return
        }
        if (this.selectedPiece.row == this.emptyPiece.row &&
            (
                this.selectedPiece.col - 1 == this.emptyPiece.col ||
                this.selectedPiece.col + 1 == this.emptyPiece.col
            )
            ||
            (
                this.selectedPiece.col == this.emptyPiece.col && (
                    this.selectedPiece.row - 1 == this.emptyPiece.row ||
                    this.selectedPiece.row + 1 == this.emptyPiece.row
                )
            )
        ) {
            this.swapPiece(this.selectedPiece, mouseUpCor)
        }
    }

    swapPiece(piece1, piece2) {
        let tmp = this.pieces[piece1.row][piece1.col]
        this.pieces[piece2.row][piece2.col] = tmp
        this.pieces[piece1.row][piece1.col] = null;

        this.pieces[piece2.row][piece2.col].row = piece2.row;
        this.pieces[piece2.row][piece2.col].col = piece2.col;

        this.emptyPiece = piece1;
    }

    startGame() {
        //create pieces
        this.pieces = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
                //create pieces from image
                let pieceimg = document.createElement('canvas')
                pieceimg.width = PIECE_SIZE;
                pieceimg.height = PIECE_SIZE;
                let pieceContext = pieceimg.getContext('2d')

                pieceContext.drawImage(
                    this.img,
                    col * PIECE_SIZE,
                    row * PIECE_SIZE,
                    PIECE_SIZE,
                    PIECE_SIZE,
                    0,
                    0,
                    PIECE_SIZE,
                    PIECE_SIZE
                )

                //create piece
                let newPiece = new piece(this, col, row + 1, pieceimg)
                this.pieces[row + 1][col] = newPiece
            }
        }
        for (let randomNumber = 0; randomNumber < 1000; randomNumber++) {
            this.randomMove()
        }
    }

    //random game
    randomMove() {
        let random = Math.round(Math.random() * 3)
        let willMove = null
        switch (random) {
            case 0:
                if (this.emptyPiece.row > 2) {
                    willMove = { row: this.emptyPiece.row - 1, col: this.emptyPiece.col }
                }
                break;
            case 1:
                if (this.emptyPiece.row < 5) {
                    willMove = { row: this.emptyPiece.row + 1, col: this.emptyPiece.col }
                }
                break;
            case 2:
                if (this.emptyPiece.col > 0) {
                    willMove = { row: this.emptyPiece.row, col: this.emptyPiece.col - 1 }
                }
                break;
            case 3:
                if (this.emptyPiece.col < 2 && this.emptyPiece.row > 1) {
                    willMove = { row: this.emptyPiece.row, col: this.emptyPiece.col + 1 }
                }
                break;
        }
        if (willMove != null) {
            this.swapPiece(willMove, this.emptyPiece)
        }
    }

    loop() {
        this.update();
        this.draw();

        setTimeout(() => {
            this.loop()
        }, 5);
    }

    update() {
        this.pieces.forEach(row => {
            row.forEach(piece => {
                if (piece !== null) {
                    piece.update();
                }
            })
        })
    }

    draw() {
        //clear screen;
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
        this.pieces.forEach(row => {
            row.forEach(piece => {
                if (piece !== null) {
                    piece.draw();
                }
            })
        })
    }
}

var g = new game();

