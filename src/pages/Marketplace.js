import './marketplace.css';
import beethoven from "./beethoven.png"
import nanayang from "./nanayang.png"
import chadlawson from "./chadlawson.png"
import michael from "./michael.png"
import brunolady from "./brunolady.png"
import ashley from "./ashley.png"

export default function Marketplace() {
    const Items = [
        { title: "Beethoven - Moonlight Sonata", imgSrc: beethoven },
        { title: "Nana Ou-Yang - Bedtime Story", imgSrc: nanayang },
        { title: "Irreplaceable - Chad Lawson", imgSrc: chadlawson },
        { title: "Home - Michael Blue", imgSrc: michael },
        { title: "Die with a Smile - Bruno Mars & Lady Gaga", imgSrc: brunolady },
        { title: "your place - Ashley Cooke", imgSrc: ashley },
    ]
    return (
        <div>
            <div className="hits">
                <h2> Monday's Hits </h2>
                <div className="button-container">
                    <button className="genre-button">Rock</button>
                    <button className="genre-button">Pop</button>
                    <button className="genre-button">K-Pop</button>
                    <button className="genre-button">Jazz</button>
                    <button className="genre-button">Funk</button>
                </div>
            </div>
            <div className="gallery">
                {Items.map((item, index) => (
                    <div className="gallery-item" key={index}>
                        <img src={item.imgSrc} alt={item.title} className="gallery-image" />
                        <p className="gallery-title">{item.title}</p>
                        <div className="button-group">
                            <button className="preview-button">Preview</button>
                            <button className="license-button">License</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="back-button">Back to Homepage</button>
        </div>
    );
};