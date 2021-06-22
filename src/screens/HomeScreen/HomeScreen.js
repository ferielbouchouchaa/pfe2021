import React, { useMemo } from 'react';
import { StyleSheet} from 'react-native';
import { connect } from 'react-redux';
import { GenericTemplate, Card, Text, ImageSlider } from '../../common';
import { magento } from '../../magento';
import FeaturedCategoryList from './FeaturedCategoryList';
import { DIMENS, SPACING } from '../../constants';
const defaultProps = {
  slider: [],
  featuredCategories: {},
  errorMessage: '',
};

const HomeScreen = ({ status, errorMessage, slider, featuredCategories }) => {
  // const media = useMemo(
  //   () =>
  //     slider.map(slide => ({
  //       source: { uri: `${magento.getMediaUrl()}${slide.image}` },
  //     })),
  //   [slider],
  // );
  
  const media =[
    {id: 1, source:require("../../assets/slider/slider1.jpg")},
    {id: 2, source:require('../../assets/slider/slider2.jpg')},
    {id: 3, source:require('../../assets/slider/slider3.png')},
    {id: 4, source:require('../../assets/slider/slider4.jpg')}
  ]
  return (
    <GenericTemplate scrollable status={status} errorMessage={errorMessage}>
      <ImageSlider
        autoplay
        containerStyle={styles.imageSliderContainer}
        media={media}
        height={DIMENS.homeScreen.sliderHeight}
      />
      {Object.keys(featuredCategories).map(key => (
        <Card type="clear" style={styles.card} key={key}>
          <Text type="subheading" bold style={styles.title}>
            {featuredCategories[key].title}
          </Text>
          <FeaturedCategoryList categoryId={parseInt(key, 10)} />
        </Card>
      ))}
     
      
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  imageSliderContainer: {
    height: DIMENS.homeScreen.sliderHeight,
  },
  card: {
    borderRadius: 0,
    marginTop: SPACING.large,
    
  },
  title: {
    marginTop: SPACING.small,
    marginLeft: SPACING.medium,
  },
});


HomeScreen.defaultProps = defaultProps;

const mapStatetoProps = ({ home }) => {
  const { status, errorMessage, slider, featuredCategories } = home;
  return {
    status,
    slider,
    errorMessage,
    featuredCategories,
  };
};

export default connect(mapStatetoProps)(HomeScreen);
