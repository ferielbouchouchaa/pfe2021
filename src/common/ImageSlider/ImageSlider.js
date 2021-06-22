import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Image from '../Image/Image';

const defaultProps = {
  resizeMode: 'cover',
  containerStyle: {},
  autoplay: false,
  onPress: null,
};


const ImageSlider = ({
  height,
  media,
  autoplay,
  resizeMode,
  containerStyle,
  onPress,
  /**
   * Rest of the props from 'react-native-swiper'
   */
  ...props
}) => {
  const ViewGroup = onPress ? TouchableWithoutFeedback : React.Fragment;
  return (
    <View style={[{ height }, containerStyle]}>
      <Swiper height={height} autoplay={autoplay} {...props}>
        {media.map((item, index) => (
          <ViewGroup
            key={String(item.id)}
            {...(onPress && { onPress: () => onPress(index) })}
          >
            <Image
              key={String(item.id)}
              style={[styles.imageStyle, { height }]}
              resizeMode={resizeMode}
              source={item.source}
              
            />
          </ViewGroup>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    top: 0,
    height:'100%',
    width : '100%',
    // resizeMode:'contain'
  },
});


ImageSlider.defaultProps = defaultProps;

export default ImageSlider;
