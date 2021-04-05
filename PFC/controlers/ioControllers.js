class IoController {
  constructor(io) {
    this.io = io;
    this.players = [];
    this.choices = { csx: null, pp: null, pr: null };
  }

  gameRoom(socket) {
    const addP = this.addPlayer(socket);
    if (this.players.length == 2) {
      this.weWillStart(this.players);
      this.listen();
    }
  }

  listen() {
    this.players.forEach((socket, i) => {
      this.ciseauxListen(socket);
      this.paperListen(socket);
      this.piereListen(socket);
      socket.on("reset", () => {
        this.reset_();
      });

      socket.on("disconnect", () => {
        console.log(`je suis deconnecté ${socket.id}`);
        this.players.splice(i, 1);
        this.players.forEach((socket) => socket.emit("can play"));
        this.reset_();
      });
    });
  }

  ciseauxListen(socket) {
    socket.on("csx", () => {
      if (this.choices.csx != null) {
        this.choices.csx.emit("match null", "ciseaux");
        socket.emit("match null", "ciseaux");
        this.choices.csx = null;
        this.reset_();
      } else {
        this.choices.csx = socket;
        this.reglesCiseaux(socket);
      }
    });
  }

  paperListen(socket) {
    socket.on("papier", () => {
      if (this.choices.pp != null) {
        this.choices.pp.emit("match null", "papier");
        socket.emit("match null", "papier");
        this.choices.pp = null;
        this.reset_();
      } else {
        this.choices.pp = socket;
        this.reglesPapier(socket);
      }
    });
  }

  piereListen(socket) {
    socket.on("piere", () => {
      if (this.choices.pr != null) {
        this.choices.pr.emit("match null", "Piere");
        socket.emit("match null", "piere");
        this.choices.pp = null;
        this.reset_();
      } else {
        this.choices.pr = socket;
        this.reglesPiere(socket);
      }
    });
  }

  reglesPapier(socket) {
    this.papierCiseaux(socket);
    this.papierPierre(socket);
  }

  reglesPiere(socket) {
    this.piereCiseaux(socket);
    this.pierePappier(socket);
  }

  reglesCiseaux(socket) {
    this.ciseauxPapier(socket);
    this.ciseauxPiere(socket);
  }

  papierCiseaux(socket) {
    if (this.choices.csx != null) {
      this.choices.csx.emit("win", "Pappier");
      socket.emit("loose", "Ciseaux");
      //socket.disconnect(true);
      //this.choices.csx.disconnect(true);
      this.reset_();
    }
  }

  papierPierre(socket) {
    if (this.choices.pr != null) {
      this.choices.pr.emit("loose", "Pappier");
      socket.emit("win", "Piere");
      //socket.disconnect(true);
      //this.choices.pr.disconnect(true);
      this.reset_();
    }
  }

  pierePappier(socket) {
    if (this.choices.pp != null) {
      this.choices.pp.emit("win", "Piere");
      socket.emit("loose", "Papier");
      //socket.disconnect(true);
      //this.choices.pp.disconnect(true);
      this.reset_();
    }
  }

  piereCiseaux(socket) {
    if (this.choices.csx != null) {
      this.choices.csx.emit("loose", "Piere");
      socket.emit("win", "Ciseaux");
      //socket.disconnect(true);
      //this.choices.csx.disconnect(true);
      this.reset_();
    }
  }

  ciseauxPiere(socket) {
    if (this.choices.pr != null) {
      this.choices.pr.emit("win", "Ciseaux");
      socket.emit("loose", "Piere");
      //socket.disconnect(true);
      //this.choices.csx.disconnect(true);
      this.reset_();
    }
  }

  ciseauxPapier(socket) {
    if (this.choices.pp != null) {
      this.choices.pp.emit("loose", "Ciseaux");
      socket.emit("win", "Papier");
      //socket.disconnect(true);
      //this.choices.csx.disconnect(true);
      this.reset_();
    }
  }

  reset() {
    this.players = [];
    this.choices.csx = null;
    this.choices.pp = null;
    this.choices.pr = null;
  }
  reset_() {
    console.log("reset");
    this.choices.csx = null;
    this.choices.pp = null;
    this.choices.pr = null;
  }

  weWillStart(players) {
    if (players.length == 2) {
      players.forEach((socket) => {
        socket.emit("GO");
      });
    }
  }

  addPlayer(socket) {
    if (this.players.length <= 1) {
      const found = this.players.find((elt) => elt.id === socket.id);
      if (found === undefined) {
        this.players.push(socket);
        return true;
      }
    }
    return false;
  }
}
module.exports = (io) => new IoController(io); // fonction qui crée un contrôleur à partir de io
