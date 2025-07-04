function lerp(a, b, t) {
    return a + (b - a) * t;
}

function getIntersection(A, B, C, D) {
    const tTop = (C.x - A.x) * (D.y - C.y) - (C.y - A.y) * (D.x - C.x);
    const uTop = (C.x - A.x) * (B.y - A.y) - (C.y - A.y) * (B.x - A.x);
    const bottom = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);

    if (bottom !== 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: A.x + t * (B.x - A.x),
                y: A.y + t * (B.y - A.y),
                offset: t
            };
        }
    }
    return null;
}


function polysIntersect(polygon1, polygon2) {
    for (let i = 0; i < polygon1.length; i++) {
        const start1 = polygon1[i];
        const end1 = polygon1[(i + 1) % polygon1.length];

        for (let j = 0; j < polygon2.length; j++) {
            const start2 = polygon2[j];
            const end2 = polygon2[(j + 1) % polygon2.length];

            if (getIntersection(start1, end1, start2, end2)) {
                return true;
            }
        }
    }
    return false;
}