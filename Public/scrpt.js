// render the welcome to my app with durition of 2.5 seconde and show the home page.
gsap.fromTo(
    ".logo-name",
    { opacity: 1 },
    {
      opacity: 0,
      display: "none",
      duration: 45,
      delay: 3.5,
    }
  );
  
  gsap.fromTo(
      ".loading-page",
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 2,
      delay: 2.5,
    }
  );