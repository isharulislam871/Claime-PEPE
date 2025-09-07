'use client';

import React, { useState, useMemo } from 'react';
import {
  Popup,
  SearchBar,
  List,
  Checkbox,
  
  Empty,
  Badge
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline,
  SearchOutline
} from 'antd-mobile-icons';
import { Button } from 'antd';

interface CheckListItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  disabled?: boolean;
}

interface CheckListPopupProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: CheckListItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onConfirm?: (selectedIds: string[]) => void;
  searchPlaceholder?: string;
  allowMultiple?: boolean;
  showCategories?: boolean;
  maxSelection?: number;
}

export default function CheckListPopup({
  visible,
  onClose,
  title = "Select Items",
  items,
  selectedItems,
  onSelectionChange,
  onConfirm,
  searchPlaceholder = "Search items...",
  allowMultiple = true,
  showCategories = false,
  maxSelection
}: CheckListPopupProps) {
  const [searchText, setSearchText] = useState('');

  // Filter items based on search text
  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items;
    
    const searchLower = searchText.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower)
    );
  }, [items, searchText]);

  // Group items by category if showCategories is true
  const groupedItems = useMemo(() => {
    if (!showCategories) return { 'All Items': filteredItems };
    
    return filteredItems.reduce((groups, item) => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, CheckListItem[]>);
  }, [filteredItems, showCategories]);

  const handleItemToggle = (itemId: string) => {
    if (!allowMultiple) {
      // Single selection mode
      onSelectionChange([itemId]);
      return;
    }

    // Multiple selection mode
    const isSelected = selectedItems.includes(itemId);
    let newSelection: string[];

    if (isSelected) {
      newSelection = selectedItems.filter(id => id !== itemId);
    } else {
      if (maxSelection && selectedItems.length >= maxSelection) {
        return; // Don't allow more selections
      }
      newSelection = [...selectedItems, itemId];
    }

    onSelectionChange(newSelection);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedItems);
    }
    onClose();
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleSelectAll = () => {
    if (maxSelection) {
      const availableItems = filteredItems.slice(0, maxSelection);
      onSelectionChange(availableItems.map(item => item.id));
    } else {
      onSelectionChange(filteredItems.map(item => item.id));
    }
  };

  const isItemSelected = (itemId: string) => selectedItems.includes(itemId);
  const canSelectMore = !maxSelection || selectedItems.length < maxSelection;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '100vh',
        borderRadius: '0px',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {selectedItems.length > 0 && (
              <Badge content={selectedItems.length} className="bg-blue-500" />
            )}
          </div>
          <CloseOutline 
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={setSearchText}
            showCancelButton
            onCancel={() => setSearchText('')}
          />
        </div>

        {/* Action Buttons */}
        {allowMultiple && filteredItems.length > 0 && (
          <div className="flex gap-2 p-4 border-b border-gray-100">
            <Button
              size="small"
              type="primary"
              onClick={handleSelectAll}
              disabled={!canSelectMore && selectedItems.length === 0}
            >
              Select All
            </Button>
            <Button
              size="small"
              danger
              onClick={handleClearAll}
              disabled={selectedItems.length === 0}
            >
              Clear All
            </Button>
            {maxSelection && (
              <div className="flex items-center text-xs text-gray-500 ml-auto">
                {selectedItems.length}/{maxSelection} selected
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Empty 
                description={searchText ? "No items found" : "No items available"} 
                image={<SearchOutline className="text-4xl text-gray-300" />}
              />
              {searchText && (
                <Button
                  size="small"
                  type="default"
                  onClick={() => setSearchText('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div>
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                  {showCategories && Object.keys(groupedItems).length > 1 && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-700">
                        {category} ({categoryItems.length})
                      </div>
                    </div>
                  )}
                  
                  <List>
                    {categoryItems.map((item) => {
                      const isSelected = isItemSelected(item.id);
                      const isDisabled = item.disabled || (!canSelectMore && !isSelected);
                      
                      return (
                        <List.Item
                          key={item.id}
                          prefix={
                            <div className="flex items-center gap-3">
                              {item.icon && (
                                <div className="w-8 h-8 flex items-center justify-center">
                                  <span className="text-lg">{item.icon}</span>
                                </div>
                              )}
                              <Checkbox
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={() => !isDisabled && handleItemToggle(item.id)}
                              />
                            </div>
                          }
                          onClick={() => !isDisabled && handleItemToggle(item.id)}
                          className={`cursor-pointer ${isDisabled ? 'opacity-50' : 'hover:bg-gray-50'}`}
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </List.Item>
                      );
                    })}
                  </List>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <Button
              block
              danger
              onClick={onClose}
              size='large'
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
               size='large'
              onClick={handleConfirm}
              disabled={!allowMultiple && selectedItems.length === 0}
            >
              <CheckOutline className="mr-2" />
              Confirm {selectedItems.length > 0 && `(${selectedItems.length})`}
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
