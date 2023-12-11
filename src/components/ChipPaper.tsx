import React, {useState} from 'react';
import {View, Text} from 'react-native';

import { Chip, Divider} from 'react-native-paper';
import {globalStyles} from '../theme/theme';

export const ChipPaper = () => {

    const [categoryList, setCategoryList] = useState<string[]>([
        'agua',
        'imagen',
        'descripcion',
        'importante',
        'tierra',
      ]);
      const [categorySelected, setCategorySelected] = useState<string[]>([]);
    
      const onSelectCategory = (data: string) => {
        //filtrar lista quitando el id elemento seleccionado
        const array = [...categoryList];
        setCategorySelected([...categorySelected, data]);
        const index = categoryList.indexOf(data);
        array.splice(index, 1);
        setCategoryList(array);
      };
    
      const onSelectCategoryRemove = (data: string) => {
        const array = [...categorySelected];
        setCategoryList([...categoryList, data]);
        const index = categorySelected.indexOf(data);
        array.splice(index, 1);
        setCategorySelected(array);
      };

  return (
    <View style={globalStyles.globalMargin}>
    <Text>Categorías</Text>
    {categoryList.length > 0 &&
      categoryList.map(data => {
        return (
          <Chip
            style={{marginVertical: 4}}
            icon="information"
            showSelectedOverlay={false}
            onPress={() => onSelectCategory(data)}>
            {data}
          </Chip>
        );
      })}
    <Divider />
    <Text>Elementos del proyecto</Text>
    {categorySelected.length > 0 &&
      categorySelected.map(data => {
        return (
          <Chip
            style={{marginVertical: 4}}
            icon="information"
            showSelectedOverlay={true}
            selectedColor="#5C95FF"
            elevated={true}
            mode="outlined"
            onPress={() => onSelectCategoryRemove(data)}>
            {data}
          </Chip>
        );
      })}
  </View>
  )
}
