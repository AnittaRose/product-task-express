async function User(event) {
    event.preventDefault();
    console.log('Reached');

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let categories = document.getElementById('categories').value; // Access the value
    let price = document.getElementById('price').value;
    let img_url = document.getElementById('img-url').value;

    console.log('title', title);
    console.log('description', description);
    console.log('categories', categories);
    console.log('price', price);
    console.log('img_url', img_url);

    let datas = {
        title,
        description,
        categories,
        price,
        img_url
    };
    console.log('datas', datas);

    let json_data = JSON.stringify(datas);
    console.log("json_data :", json_data);

    try {
        let response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json_data,
        });
       
        if(response){
            alert("submit successfully");
        }else{
            alert("submit failed")
        }
         window.location=`product-view.html`

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result = await response.json(); // Assuming the server responds with JSON
        console.log('response : ', result);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


async function viewdata(){
    try {
        let datas = await fetch('/getproducts')
        console.log('datas : ',datas);

        let parsed_datas = await datas.json();
        console.log('parsed_datas',parsed_datas);

        let datacontainer = document.getElementById('datacontainer');


        let rows = ''

        for(i=0;i<parsed_datas.length;i++){
            rows = rows+`
          
        <div class="px-3">
            <div class="shadow p-3 mb-5 bg-body rounded border border-white border-2">
                <div class="text-center"><img src="${parsed_datas[i].img_url}" class="w-100"></div>
                <div class="fs-5 fw-bold pt-4 text-center">${parsed_datas[i].title.slice(0,20)+""}</div>
                <div class="des pt-3 text-center">${parsed_datas[i].description.slice(0,30)+""} </div>
                <div class="cat pt-3 text-center">${parsed_datas[i].categories.slice(0,30)+""}</div>
                <div class="price pt-3 link-danger text-center">$${parsed_datas[i].price}</div>
                <div class="d-flex justify-content-between align-items-center">
                <div class="pt-4 "><button onClick="handlclick('${parsed_datas[i]._id}')" class="p-1 px-3 bg-dark border border-white border-2 link-light fs-5 ">view</button></div>
                <div class="pt-3"><i class="fa fa-trash-o" style="font-size:38px;"onclick="deleteclick('${parsed_datas[i]._id}')"></i></div>
                </div>
            </div>
        </div>`
            
        }
        datacontainer.innerHTML = rows;
    } catch (error) {
        console.log('error',error);
    }
}

 function handlclick(id) {
    console.log('id',id);
    window.location=`view.html?id=${id}`

}
async function singledata(){
    let params = new URLSearchParams(window.location.search);
    console.log('params',params)

    let id =  params.get('id');
    console.log('id :',id);
    try {
        let response = await fetch(`/single?id=${id}`)
        let parsed_response = await response.json()
        console.log('parsed_response',parsed_response)


        let container = document.getElementById('container');
        let row=`
        <div class="p-5">
        <div class="border border-white border-5 w-25 p-5 position-absolute top-50 start-50 translate-middle border-double">
                <div class="fs-5 fw-bold text-center link-light">${parsed_response.title.slice(0,40)+""}</div>
                <div class=" pt-2 link-light text-center">${parsed_response.description.slice(0,40)+""}</div>
                <div class="pt-2 text-center link-light">${parsed_response.categories.slice(0,30)+""}</div>
                <div class="pt-2 text-center link-light">$ ${parsed_response.price}</div>
                <div class="pt-4"><img src = "${parsed_response.img_url}" class="w-100"></div>
                <div class="pt-3 p-4 text-center"><button class="text-center p-3 px-4 fw-bold  bg-dark border border-white link-light">Add To Cart</button></div>
        </div>
        </div>
        `

        container.innerHTML=row;
    } catch (error) {
        console.log('error',error);
    }


}

async function deleteclick(id){
    console.log("id from delete",id)

    try {
        let del = await fetch(`/delete?id=${id}`,{method:'DELETE'})
        let data = await del.json();
        console.log('data',data);
        viewdata()
        if(del.status === 200){
            alert("deleted successfully")
        }
        else{
            alert("deletion failed")
        }
      
    } catch (error) {
        console.log("error",error);
    }
}






