import 'remixicon/fonts/remixicon.css'

// eslint-disable-next-line react/prop-types
export default function EmojiText({children}) {
    return(
        <div className="inline-block py-2">
            <p className="inline-block">{children}</p>
            <i className="ri-arrow-right-line text-slate-400 inline-block"></i>
        </div>
    )
}