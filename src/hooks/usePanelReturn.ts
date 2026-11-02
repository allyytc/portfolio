import { useRef } from 'react'
/** Preserve a list's reading position when its detail replaces it in the same dialog. */
export function usePanelReturn() {
  const position=useRef<number|null>(null)
  return {
    save:()=>{position.current=document.querySelector<HTMLDialogElement>('.portfolio-dialog')?.scrollTop??0},
    clear:()=>{position.current=null},
    restore:(id:string)=>requestAnimationFrame(()=>{
      const dialog=document.querySelector<HTMLDialogElement>('.portfolio-dialog')
      if(dialog&&position.current!==null)dialog.scrollTop=position.current
      document.getElementById(id)?.focus({preventScroll:position.current!==null})
    }),
  }
}
