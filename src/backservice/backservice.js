export async function loginService(username, password) {
    try {
        const data = await fetch("http://64.227.139.217:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // specify the content type
            },
            body: JSON.stringify({
                username,
                password
            }),
        })
        const jsonData = await data.json()
        if (jsonData?.status === true) {
            localStorage.setItem("username", username)
            localStorage.setItem("secret", password)
            return jsonData
        } else if (jsonData?.status === 400) {
            alert("incorrect password");
        } else if (jsonData?.status === 404) {
            alert("no user found");
        } else {
            alert("invalid serer response");
        }
    } catch (error) {
        alert(error);

    }
}

export function checkLoginService(){
    const username = localStorage.getItem("username")
    const password = localStorage.getItem("secret")
    if (username && password) {
        return {username,password}
    } else {
        return false
    }
}

export async function getMachines(cid) {
    try {
        const data = await fetch("http://64.227.139.217:3000/getMachine/"+cid)
        const md = await data.json()
        if (md.status==200) {
            return md.data
        }else{
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }
}

export async function getMachineData(mid) {
    try {
        const response = await fetch('http://64.227.139.217:3000/getMachineData/'+mid);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            
            return false
        }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}

export async function logoutService() {
    try {     
        localStorage.clear("username")
        localStorage.clear("secret")
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

