import * as vscode from 'vscode'
const axios = require('axios')
const base_url = 'https://agile-tundra-65071.herokuapp.com/'


export class send_time{
    private start_time: number = Date.now();
    private end_time: number = Date.now();
    private file_type: string = "";
    private file_name: string = "";
    private disposable!: vscode.Disposable;
    private isCoding: boolean = false;
    private codingTime: number[] = [];
    // private breakTime: number[] = [];
    private username: string = "";
    private password: string = "";
    private interval_time: number = 0;
    private token: string = "b99bf467f68093508fc15a07da85b634";
    private dict:{[index:string]: string} = {
        "c": "c",
        "cpp": "c++",
        "css": "css",
        "go": "go",
        "java":"java",
        "js":"javascript",
        "py": "python",
        "rb": "ruby",
        "rs": "rust",
        "ts": "typescript"
    }
    public init(): void{
        this.get_editor_event();
    }

    public async register_user():Promise<void>{
        var new_user:string = "";
        const register_usr = await vscode.window.showInputBox({
            prompt:"登録するユーザーネームを入力してください"
        });
        if(register_usr){
            //console.log(register_usr);
            new_user = register_usr;
        }else{
            vscode.window.showWarningMessage("failed to get")
        }
        const url = base_url + "api/register/"+register_usr;
        console.log(url)
        axios.get(url).then((res) =>{
            console.log("authenticated")
            console.log(res)
            this.token = res.token;
            this.username = new_user;
        }).catch((err) =>{
            //これをウィンドウでだしたいな
            console.log('error')
            console.log(err)
        })
    }

    public async user_auth(set_interval: boolean): Promise<void>{
        console.log("please log in!")
        const usr = await vscode.window.showInputBox({
            prompt: "ユーザーネームを入力してください"
        });
        if(usr){
            this.username = usr
        }else{
            vscode.window.showWarningMessage("failed to get")
        }
        const pass = await vscode.window.showInputBox({
            password:true,
            prompt: "パスワードを入力してください"
        })
        if(pass){
            this.password = pass
        }
        else{
            vscode.window.showWarningMessage("failed to get")
        }
        //console.log(this.username)
        //console.log(this.password)
        //ユーザー認証処理をする
        if(set_interval){
            this.set_interval_time();
        }
    }

    public async set_interval_time():Promise<void>{
        const time = await vscode.window.showInputBox({
            prompt: "どのくらい作業しますか？(分で入力してください)"
        });
        if(time){
            this.interval_time = Number(time)*60;
            vscode.window.showInformationMessage("作業時間は"+time+"分です．")
        }
        else{
            vscode.window.showWarningMessage('failed to get')
        }
    }

    public dispose(): void{
        this.disposable.dispose()
    }

    private get_editor_event(): void{
        if(!this.file_type){
            let file= vscode.window.activeTextEditor?.document.fileName;
            //let file: string = doc.fileName.split("/").reverse()[0];
            if(file){
                let type: string = file.split("/").reverse()[0].split(".")[1]
                type = this.dict[type]
                this.file_type = type;
            }
        }
        let subscription: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this.onEvent, this, subscription)
        vscode.window.onDidChangeActiveTextEditor(this.onEvent, this, subscription)
        vscode.workspace.onDidSaveTextDocument(this.checkBreak, this, subscription)
        this.disposable = vscode.Disposable.from(...subscription)
    }
    //ファイル名とファイルタイプを更新する
    private set_file_type(file_name: string, file_type: string){
        //更新前の作業ログをDBに送る
        this.send_data()
        //更新する
        this.file_name = file_name;
        this.file_type = file_type;
    }
    //送るデータ
    // 作業時間，フィアルの内容，ユーザー名
    private send_data(): void{
        this.update_end_time()
        const time:number = this.get_elapsed_time()
        if(time != 0){
            this.codingTime.push(time)
            this.isCoding = false;
            this.check_break_time(this.interval_time)
            //console.log("file has changed")
            //console.log(time)
            //console.log(this.username)
            //console.log(this.file_type)
            const args = {
                body:{
                    filetype: this.file_type,
                    work_time: time,
                    token: this.token
                },
                headers:{
                    "Content-type":"application/json"
                }
            }
            //console.log(this.codingTime)
            const url = base_url+"api/"+ this.username
            //console.log(args)
            console.log(url)
            axios.post(url, args)
            .then(function(res){
                console.log("data send!")
            })
            .catch(function(error){
                console.log(error, args)
            })
        }
    }

    private update_start_time(): void{
        this.start_time = Date.now();
    }

   private update_end_time():void{
       this.end_time = Date.now();
   }
   //ファイルが保存された時，作業時間の評価をする
    private checkBreak(): void{
        this.update_end_time()
        this.codingTime.push(this.get_elapsed_time());
        this.update_start_time();
        this.check_break_time(this.interval_time)
    }
    //文字が入力された時とか，エディタ側で操作した時に実行される
    private onEvent(): void{
        let editor = vscode.window.activeTextEditor;
        if(editor){
            let doc = editor.document;
            if(doc){
                let file: string = doc.fileName.split("/").reverse()[0];
                let type: string = file.split(".")[1]
                type = this.dict[type]
                //ファイル名が変化した時，作業していたファイルを閉じたとして
                //DBに作業時間をポストする
                if(file != this.file_name){
                    //ファイル名と種類を更新する
                    this.set_file_type(file, type);
                }
                //console.log(this.file_type)
                if(file && !this.isCoding){
                    //this.start_time = Date.now();
                    this.update_start_time()
                    this.isCoding = true;
                }
                else if(this.isCoding){
                    this.update_end_time()
                }
            }
        }
        //console.log("start time", this.start_time)
        //console.log("end time", this.end_time)
        //console.log("elapsed time", this.get_elapsed_time())
    }
    private get_elapsed_time(): number{
        if(this.start_time >= this.end_time)return 0;
        //秒で返す
        //作業時間を貯める配列の作業時間を合計したものの合計値にしたい
        return (this.end_time - this.start_time)/1000;
    }
    private total_coding_time(): number{
        let total: number = this.codingTime.reduce((sum, element)=>sum+element, 0);
        return total;
    }

    private check_break_time(interval: number): boolean{
        //console.log(this.codingTime)
        if(this.total_coding_time() >= interval){
            vscode.window.showInformationMessage("take a break");
            this.codingTime = []
            return true;
        }
        else{
            return false;
        }
    }
}