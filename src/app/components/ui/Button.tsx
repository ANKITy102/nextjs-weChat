import { ButtonHTMLAttributes, FC } from 'react'
import { cva , VariantProps} from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'


const buttonVariants = cva(
    'acitve:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-slate-400 focus:ring-offset-2 disabled:50 disabled:pointer-events-none'
   , {
        variants:{ //this is inbuilt cva
            variant:{ //this is not inbuilt

                default: 'bg-slate-900 text-white hover:bg-slate-800',
                ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200',
            },
            size:{    //this is not inbuilt
                default: "h-10 py-2 px-4 px-4",
                sm: 'h-9 px-2',
                lg: 'h-11 px-8',
            },
        },
        defaultVariants:{
            variant: 'default',
            size: 'default',
        }
    }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants> {
    isLoading?: boolean   //?: represent it is optional
}
const Button: FC<ButtonProps> = ({className, children,variant, isLoading,size, ...props}) => {
  return <button className={cn(buttonVariants({variant,size,className}))} disabled={isLoading}  {...props}>
    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin'/> : null}
    {children}
  </button>
} 

export default Button