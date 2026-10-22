 
  const form=document.getElementById("form");
  const posttitle=document.getElementById("posttitle");
  const discription=document.getElementById("discription");
  const addbtn=document.getElementById("addbtn");
  const updatebtn=document.getElementById("updatebtn");
  const spiner=document.getElementById("spiner")

const cl=console.log;

// READ 

 const base_url="https://jsonplaceholder.typicode.com/";

 const post_url=`${base_url}/posts`;

   // GET ALL

  let xhr= new XMLHttpRequest();

  xhr.open("GET",post_url);
  xhr.send();


 xhr.onload= function(){
            
    let data=JSON.parse(xhr.response)
    let res=``;
  data.forEach(post=>{
           res+=` <div class="col-md-4 mb-4" id="${post.id}">
           <div class="card h-100 border  border-dark">
                    <div class="card-header">
                         <h3 class="m-0">${post.title}</h3>
                    </div>

                    <div class="card-body">
                         <p>${post.body}</p>
                    </div>
                    
                    <div class="card-footer d-flex justify-content-between p-3">
                        <button onclick=edit(this) class="bg-primary text-white" id="editbtn">EDIT</button>
                         <button onclick=deletecards(this) class="bg-danger text-white" id="deletebtn">DELETE</button>
                    </div>
                </div>
               </div> `
    })
     row2.innerHTML = res;
 }



// CREATE


 function create(eve){
    eve.preventDefault()
    let newobj={
         title:posttitle.value,
         body:discription.value,
    }       
          xhr.open("post",post_url)
          xhr.send(JSON.stringify(newobj))
          form.reset()

         xhr.onload=()=>{
             if(xhr.status===201){
                 let postresponse=JSON.parse(xhr.response)
                 cl(postresponse)
                 let newpostcard=document.createElement("div");
                 newpostcard.className="col-md-4 mb-4"     
                 newpostcard.id= postresponse.id
                 newpostcard.innerHTML=`<div class="card h-100 border  border-dark">
                    <div class="card-header">
                         <h3 class="m-0">${newobj.title}</h3>
                    </div>

                    <div class="card-body">
                         <p>${newobj.body}</p>
                    </div>
                    
                    <div class="card-footer d-flex justify-content-between p-3">
                        <button onclick=edit(this) class="bg-primary text-white" id="editbtn">EDIT</button>
                        <button onclick=deletecards(this) class="bg-danger text-white" id="deletebtn">DELETE</button>
                    </div>
                </div>`

                console.log(newpostcard)

                   row2.prepend(newpostcard);
                   form.reset();
                 }
         }
 }


 // edit 

function edit(ele) {
    let editid = ele.closest(".col-md-4 ").id 
 
    spiner.classList.remove("d-none")

    //  cl(editid)
    localStorage.setItem("update_id", editid)  
    let edit_url = `${base_url}posts/${editid}`;
    //    cl(edit_url)
    let xhr = new XMLHttpRequest()
    xhr.open("GET", edit_url)
    xhr.send(null);

    xhr.onload = () => {
        if (xhr.status == 200) {
            let res = JSON.parse(xhr.response)
            //  cl("yes")
            // patch
            posttitle.value = res.title,
                discription.value = res.body


            addbtn.classList.add("d-none")
            updatebtn.classList.remove("d-none");

        } else {
            cl("error!!")
        }

    }

    spiner.classList.add("d-none")

}


// // update

function update() {
    let update_id = localStorage.getItem('update_id');


    //    cl(update_id)
    localStorage.removeItem("update_id")
    let updatedobj = {
        title: posttitle.value,
        body: discription.value
    }

    // patch newobj in database

    let xhr = new XMLHttpRequest();
    let update_url = `${post_url}/${update_id}`;
    //   cl(update_url)
    xhr.open("PATCH", update_url);
    xhr.send(JSON.stringify(updatedobj));
    spiner.classList.remove("d-none")


    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let apiresponse = JSON.parse(xhr.response)
           

            // make changes in card on ui

            let updatedcard = document.getElementById(update_id)
            updatedcard.querySelector("h3").innerHTML = updatedobj.title;
            updatedcard.querySelector("p").innerHTML = updatedobj.body;

             // change btns
            form.reset();
            addbtn.classList.remove("d-none")
            updatebtn.classList.add("d-none");
           
            Swal.fire({
                text: `Post  ${updatedobj.title} updated successfully`,
                icon: "success",

                timer: 2500
            })


        } else {
            cl("error!!!")
        }

    }
     spiner.classList.add("d-none")
}


// // delete 

function deletecards(ele) {
    let deleteid = ele.closest(".col-md-4").id
        
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
           spiner.classList.remove("d-none")
  let xhr = new XMLHttpRequest();
    let del_url = `${post_url}/${deleteid}`

        xhr.open("DELETE", del_url);
        xhr.send(null);

        xhr.onload = () => {
            if (xhr.status === 200) {
                ele.closest(".col-md-4").remove();
                Swal.fire({
                    text: `Post  with id : ${deleteid} deleted successfully`,
                    icon: "success",
                    timer: 2500
                })
                  spiner.classList.add("d-none")

            }
        }
         
    }
     
        
  });
};
  


form.addEventListener("submit", create);
updatebtn.addEventListener("click", update);
