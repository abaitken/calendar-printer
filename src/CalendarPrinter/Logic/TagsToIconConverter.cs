using CalendarPrinter.Model;
using System;
using System.Collections.Generic;

namespace CalendarPrinter.Logic
{
    internal class TagsToIconConverter
    {
        private readonly List<TagMapping> _tagMapping;

        public TagsToIconConverter(List<TagMapping> tagMapping)
        {
            _tagMapping = tagMapping;
        }

        internal TagMapping GetIcon(List<string> tags)
        {
            if (tags.Count == 0)
                return null;

            foreach (var mapping in _tagMapping)
            {
                if (ContainsTags(mapping.Tags, tags))
                    return mapping;
            }

            return null;
        }

        private bool ContainsTags(List<string> needles, List<string> haystack)
        {
            foreach (var needle in needles)
            {
                if(!haystack.Contains(needle))
                    return false;
            }
            return true;
        }
    }
}