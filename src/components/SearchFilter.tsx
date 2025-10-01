/**
 * Search and filter component for chat history
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  HStack,
  VStack,
  Badge,
  Select,
  useColorModeValue,
  Collapse,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { Text as ChakraText } from '@chakra-ui/react';
import { SearchIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FiFilter } from 'react-icons/fi';
import { ChatHistoryItem } from '../utils/database';

interface SearchFilterProps {
  conversations: ChatHistoryItem[];
  onFilteredConversations: (filtered: ChatHistoryItem[]) => void;
  onSearch: (query: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  conversations,
  onFilteredConversations,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Extract unique tags from conversations (if any)
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    conversations.forEach(conversation => {
      // If conversations had tags, we would extract them here
      // For now, we'll create some example tags based on content
      if (conversation.question.toLowerCase().includes('code')) tags.add('code');
      if (conversation.question.toLowerCase().includes('help')) tags.add('help');
      if (conversation.question.toLowerCase().includes('explain')) tags.add('explanation');
    });
    return Array.from(tags);
  }, [conversations]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conversation =>
        conversation.question.toLowerCase().includes(query) ||
        (conversation.answer && conversation.answer.toLowerCase().includes(query))
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(conversation => 
            new Date(conversation.timestamp) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(conversation => 
            new Date(conversation.timestamp) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(conversation => 
            new Date(conversation.timestamp) >= filterDate
          );
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'alphabetical':
          return a.question.localeCompare(b.question);
        default:
          return 0;
      }
    });

    return filtered;
  }, [conversations, searchQuery, dateFilter, sortBy, selectedTags]);

  // Update parent component when filtered results change
  React.useEffect(() => {
    onFilteredConversations(filteredConversations);
  }, [filteredConversations, onFilteredConversations]);

  // Update search in parent component
  React.useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    setDateFilter('all');
    setSortBy('newest');
    setSelectedTags([]);
  };

  const hasActiveFilters = dateFilter !== 'all' || sortBy !== 'newest' || selectedTags.length > 0;

  return (
    <VStack spacing={3} align="stretch">
      {/* Search Bar */}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg={bg}
          borderColor={borderColor}
        />
        {searchQuery && (
          <InputRightElement>
            <IconButton
              aria-label="clear search"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              onClick={handleClearSearch}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {/* Filter Toggle */}
      <HStack justify="space-between">
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FiFilter />}
          onClick={() => setShowFilters(!showFilters)}
          rightIcon={<ChevronDownIcon transform={showFilters ? 'rotate(180deg)' : 'none'} />}
        >
          Filters
          {hasActiveFilters && (
            <Badge ml={2} colorScheme="blue" borderRadius="full">
              Active
            </Badge>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </HStack>

      {/* Filter Panel */}
      <Collapse in={showFilters}>
        <Box p={4} bg={bg} borderRadius="md" border="1px solid" borderColor={borderColor}>
          <VStack spacing={4} align="stretch">
            {/* Date Filter */}
            <Box>
              <ChakraText fontSize="sm" fontWeight="medium" mb={2}>
                Date Range
              </ChakraText>
              <Select
                size="sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
              </Select>
            </Box>

            <Divider />

            {/* Sort Options */}
            <Box>
              <ChakraText fontSize="sm" fontWeight="medium" mb={2}>
                Sort By
              </ChakraText>
              <Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="alphabetical">Alphabetical</option>
              </Select>
            </Box>

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <>
                <Divider />
                <Box>
                  <ChakraText fontSize="sm" fontWeight="medium" mb={2}>
                    Tags
                  </ChakraText>
                  <CheckboxGroup
                    value={selectedTags}
                    onChange={(values) => setSelectedTags(values as string[])}
                  >
                    <Stack spacing={2}>
                      {availableTags.map(tag => (
                        <Checkbox key={tag} value={tag} size="sm">
                          <Badge colorScheme="blue" variant="subtle">
                            {tag}
                          </Badge>
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </>
            )}
          </VStack>
        </Box>
      </Collapse>

      {/* Results Summary */}
      <HStack justify="space-between" fontSize="sm" color="gray.500">
        <ChakraText>
          {filteredConversations.length} of {conversations.length} conversations
        </ChakraText>
        {searchQuery && (
          <ChakraText>
            Results for "{searchQuery}"
          </ChakraText>
        )}
      </HStack>
    </VStack>
  );
};
