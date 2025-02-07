import pop from "./pop.png";
import country from "./country.png";
import rock from "./rock.png";
import classical from "./classical.png";
import EDM from "./edm.png";
import TrendingHits from "./trendinghits.png"
import "./hmarketstyles.css"
function Homemarket() {
    const categories = [
        { name: 'Pop', imgSrc: pop },
        { name: 'Country', imgSrc: country },
        { name: 'Rock', imgSrc: rock },
        { name: 'Classical', imgSrc: classical },
        { name: 'EDM', imgSrc: EDM },
        { name: 'Trending Hits', imgSrc: TrendingHits },
    ]
    return (
        <div className="home-market">
            <h1 className="UpperText"> Music Marketplace</h1>
            <p className="LowerText">
                License our pre-cleared catalog. Subscribe for unlimited access to
                60,000+ pre-cleared songs for personal and business use across social
                and digital media platforms.
            </p>
            <div className="music-grid">
                {categories.map((category) => (
                    <div className="music-card" key={category.name}>
                        <img id="images" src={category.imgSrc} alt={category.name} className="music-image" />
                        <div className="music-text">{category.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homemarket;
