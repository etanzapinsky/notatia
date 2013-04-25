from haystack import indexes
from api.models import Capsule

class CapsuleIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    last_modified = indexes.DateTimeField(model_attr='last_modified')

    def get_model(self):
        return Capsule
