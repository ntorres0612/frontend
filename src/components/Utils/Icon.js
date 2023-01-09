import React, { Component } from 'react';

import { CiDeliveryTruck, CiUser, CiAlignBottom, CiPaperplane, CiHome, CiBoxes } from 'react-icons/ci';



class Icon extends Component {
    components = {
        CiHome: CiHome,
        CiDeliveryTruck: CiDeliveryTruck,
        CiUser: CiUser,
        CiAlignBottom: CiAlignBottom,
        CiPaperplane: CiPaperplane,
        CiBoxes: CiBoxes,

    };
    render() {
        const TagName = this.components[this.props.icon || 'CiHome'];
        return <TagName />
    }
}
export default Icon;