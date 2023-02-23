import React, {Component} from 'react';
import {Text, View, ScrollView, Animated, Easing} from 'react-native';

export class AHMYNoticeView extends Component {
    static defaultProps = {
        notice: '', //提示文案
        speed: 0, //滚动样式
        style: {}, //样式
        textStyle: {}, //字体样式
    }

    constructor(props) {
        super(props);
        this.state = {
            notice: props.notice,
            translateX: new Animated.Value(0)
        }
        this.noticeTextWidth = 0;
        this.firstScroll = true;
        this.mounted = false;
    }

    updateNotice(notice) {
        this.animation && this.animation.stop();
        this.noticeTextWidth = 0;
        this.firstScroll = true;
        this.setState({
            notice: notice,
            translateX: new Animated.Value(0)
        })
    }

    componentWillUnmount() {
        this.mounted = false;
        this.animation && this.animation.stop();
    }

    componentDidMount() {
        this.mounted = true;
    }

    scrollAnimation() {
        if (!this.mounted) {
            return;
        }
        let speed = this.props.speed || 22;
        let duration = this.firstScroll ? this.noticeTextWidth*speed : (this.noticeTextWidth+this.scrollWidth)*speed;
        let delay = this.firstScroll ? 1000 : 0;
        this.animation = Animated.timing(this.state.translateX,{
            toValue: -this.noticeTextWidth,
            duration: duration,
            easing: Easing.linear,
            delay: delay,
            useNativeDriver: true,
        })
        this.animation && this.animation.start(()=>{
            if (!this.mounted) {
                return;
            }
            this.firstScroll = false;
            this.state.translateX.setValue(this.scrollWidth);
            this.scrollAnimation();
        })
    }


    render() {
        this.scrollWidth = this.props.style.width;
        if (!this.state.notice || this.state.notice.length === 0) {
            return null;
        }
        return (
            <View style={this.props.style}>
                <ScrollView
                    style={{width: this.scrollWidth}}
                    scrollEnabled={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <Animated.View
                        style={[{flex: 1}, {
                            transform: [{translateX: this.state.translateX}]
                        }]}
                        onLayout={(event) => {
                            const {width, height} = event.nativeEvent.layout;
                            this.noticeTextWidth = width;
                            if (this.noticeTextWidth > this.scrollWidth) {
                                this.scrollAnimation();
                            }
                        }}
                    >
                        <Text
                            numberofLines={1}
                            style={this.props.textStyle}
                        >{this.state.notice}</Text>
                    </Animated.View>
                </ScrollView>
            </View>
        )
    }
}