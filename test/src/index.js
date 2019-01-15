import './test.css'
import React from 'react'

class Com extends React.Component{
    render(){
        return React.createElement('div', {className: 'test'}, 'test text')
    }
}
