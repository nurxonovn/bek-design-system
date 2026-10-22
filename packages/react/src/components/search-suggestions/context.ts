import { createContext } from 'react';

/** SearchSuggestions → qatorlar: klaviatura bilan tanlangan option (`aria-activedescendant`). */
export const SuggestionsContext = createContext<{ activeId?: string }>({});
