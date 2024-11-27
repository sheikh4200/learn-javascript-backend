class apiError extends Errors {
constructor( 
            statusCode,
             message="something want  wrong",
             errors=[],
             stack=''
            ){
                super(message)
                this.statusCode = statusCode
                this.data = null
                this.message = message
                this.success = false
                this.errors = errors


                if(stack){
                    this.stack = stack
                }else{
                    Error.captureStackTrace(this,this.constructor)
                }
            }}
            
export {apiError}