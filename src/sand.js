import {VectorShape} from "./shape";

class Sand{

}

let castles = new Map();


export const getCastle = (p5, id, scale) => {
    if (!castles.has(id)) {
        throw new Error('no body part with id ' + id)
    }
    return VectorShape.create(p5, castles.get(id), scale)
}

export const parseCastles=(svgXml)=>{
    let partsGrouped = svgXml.getChildren('g');

    for (let i = 0; i < partsGrouped.length; i++) {
        const group = partsGrouped[i]
        let groupId = partsGrouped[i].getString('id');
        const paths = group.getChildren('path')
        const pathStrings = [];
        for (let j = 0; j < paths.length; j++) {
            const path = paths[j]
            pathStrings.push(path.getString('d'))
        }
        castles.set(groupId, pathStrings)
    }
}
