import React, { useEffect} from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { getOrders } from '../../store/actions';
import { GenericTemplate, MessageView, Spinner, Button } from '../../common';
import OrderListItem from './OrderListItem';
import Status from '../../magento/Status';
import { SPACING } from '../../constants';
import colors from '../../../theme/colors';

const defaultProps = {
  orders: [],
  ordersErrorMessage: '',
  moreOrdersErrorMessage: '',
};

// TODO: Show error message in case of error
const OrdersScreen = ({
  ordersStatus,
  moreOrdersStatus,
  totalOrders,

  route: {
    params: { customerId },
  },
  orders,
  getOrders: _getOrders,
  navigation,
}) => {
  

  useEffect(() => {

    if (ordersStatus === Status.DEFAULT) {
      refreshList();
    }
  }, []);

  const refreshList = (offset = 0) => {
    _getOrders(customerId, offset);
  };

  const renderItem = ({ item }) => (
    <OrderListItem item={item} navigation={navigation} />
  );

  const renderFooter = () => {
    if (moreOrdersStatus === Status.LOADING) {
      return <Spinner size="small" style={styles.spaceBottom} />;
    }

    if (
      totalOrders !== 0 &&
      moreOrdersStatus !== Status.ERROR &&
      orders.length < totalOrders
    ) {
      return (
        <Button
          type="clear"
          style={styles.loadmore}
          title='load more'
          onPress={() => refreshList(orders.length)}
        />
      );
    }

    return <></>;
  };

  return (
    <GenericTemplate status={Status.SUCCESS}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          ordersStatus === Status.SUCCESS && (
            <MessageView
              message="You don't have any order"
            />
          )
        }
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.flatListConatiner,
          orders.length === 0 && { flex: 1 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={
              ordersStatus === Status.DEFAULT || ordersStatus === Status.LOADING
            }
            onRefresh={() => refreshList()}
            title="refresh"
            tintColor={colors.colors.primary}
            colors={[colors.colors.primary]}
          />
        }
      />
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  flatListConatiner: {
    paddingHorizontal: SPACING.large,
    paddingTop: SPACING.large,
  },
  loadmore: {
    paddingVertical: 0,
    marginBottom: SPACING.small,
  },
});



OrdersScreen.defaultProps = defaultProps;

const mapStateToProps = ({ account }) => {
  const {
    orders,
    ordersStatus,
    ordersErrorMessage,
    moreOrdersStatus,
    moreOrdersErrorMessage,
    totalOrders,
  } = account;
  return {
    orders,
    ordersStatus,
    ordersErrorMessage,
    moreOrdersStatus,
    moreOrdersErrorMessage,
    totalOrders,
  };
};

export default connect(mapStateToProps, {
  getOrders,
})(OrdersScreen);
