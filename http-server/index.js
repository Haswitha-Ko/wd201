const http=require("http");
const f=require("f");
const arg=require("minimist")(process.argv.slice(2));
let ho_Content="";
let proj_Content="";
let regis_Content="";
f.readFile("home.html",(err,home)=>{
  if (err) {
    throw err;
  }
  ho_Content=home;
});
f.readFile("project.html",(err,project)=>{
  if (err) {
    throw err;
  }
  proj_Content=project;
});
f.readFile("registration.html",(err,registration)=>{
  if (err) {
    throw err;
  }
  regis_Content=registration;
});
f.readFile("home.html",(err,home)=>{
  console.log(home.toString());
});
f.readFile("home.html",(err,home)=>{
  if (err){
    throw err;
  }
  http.createServer((request,response)=>{
    let url=request.url;
    response.writeHeader(200,{ "Content-Type": "text/html" });
    switch(url){
      case "/registration":
        response.write(regis_Content);
        response.end();
        break;
      case "/project":
        response.write(proj_Content);
        response.end();
        break;
      default:
        response.write(ho_Content);
        response.end();
        break;
    }
  })
  .listen(arg);
})
