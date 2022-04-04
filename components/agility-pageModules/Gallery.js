import { useEffect, useState } from 'react'

const Gallery = ({ module }) => {

    const [gallery, setGallery] = useState([])

    console.log(module)

    useEffect(() => {
        const init = async () => {
            const data = await fetch(`/api/gallery?id=${module.fields.gallery.galleryid || module.fields.gallery.galleryID}`, {
                method: 'GET',
            })
            const res = await data.json()
            setGallery(res.galleryData)
        }
        init()
    }, [])

    return (
        <div className="gallery">
            {gallery.length > 0 && gallery.map((img, i) => {
                return (
                    <div key={i} className="gallery__item">
                        <img src={img.url} alt={img.fileName} className="block w-64 h-64 object-cover" />
                    </div>
                )
            }
            )}
        </div>
    )
}

export default Gallery