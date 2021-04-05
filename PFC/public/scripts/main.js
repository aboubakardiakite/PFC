const socket = io("http://localhost:3000/pfc");

const res = document.getElementById("yc");

const papier = () => {
  const papier = document.getElementById("papier");
  papier.addEventListener("click", () => {
    socket.emit("papier");
    res.textContent = "Votre choix : Papier";
  });
};

const ciseaux = () => {
  const csx = document.getElementById("csx");
  csx.addEventListener("click", () => {
    socket.emit("csx", "csx");
    res.textContent = "Votre choix : Ciseaux";
  });
};
const pierre = () => {
  const pr = document.getElementById("piere");
  pr.addEventListener("click", () => {
    socket.emit("piere");
    res.textContent = "Votre choix : Pière";
  });
};

const effect = () => {
  const imgs = document.getElementsByTagName("img");
  console.log(imgs.length);
  Array.from(imgs).forEach((elt) => {
    elt.addEventListener("mouseover", () => {
      elt.style.backgroundColor = "silver";
    });

    elt.addEventListener("mouseleave", () => {
      elt.style.backgroundColor = "white";
    });
  });
};

socket.on("can play", () => {
  const sp = document.getElementById("dplay");
  sp.textContent = "waiting for another player ...";
});

socket.on("wait", () => {
  const sp = document.getElementById("dplay");
  sp.textContent = "game room not available";
});

socket.on("GO", () => {
  effect();
  papier();
  ciseaux();
  pierre();

  const sp = document.getElementById("dplay");
  sp.textContent = "YOU CAN PLAY !";
  sp.style.color = "gold";
});

socket.on("perdu", () => {
  console.log("perdu");
});

socket.on("won", () => {
  console.log("woon");
});

socket.on("loose", (choice) => {
  console.log("you loose");
  dispalyRes(choice);
  const dpl = document.getElementById("dplay");
  dpl.textContent = "You Loose !!! ";
  reset_();
});

socket.on("win", (choice) => {
  console.log("you won");
  dispalyRes(choice);
  const dpl = document.getElementById("dplay");
  dpl.textContent = "You WOON !!! ";
  reset_();
});

const dispalyRes = (choice) => {
  const choiceAd = document.getElementById("ac");
  choiceAd.textContent = `Choix adversaire : ${choice}`;
};

socket.on("match null", (choice) => {
  console.log("match null");
  dispalyRes(choice);
  const dpl = document.getElementById("dplay");
  dpl.textContent = "MATCH NULL ! ";
  reset_();
});

const reset = () => {
  const choiceAd = document.getElementById("ac");
  const choiceAd_ = document.getElementById("yc");
  choiceAd_.textContent = "Votre choix :";
  choiceAd.textContent = "Choix adversaire :";
};

const reset_ = () => {
  setTimeout(() => {
    const dpl_ = document.getElementById("dplay");
    dpl_.textContent = "Play Again";

    reset();
    socket.emit("reset");
  }, 1000);
};
